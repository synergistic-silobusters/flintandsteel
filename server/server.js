/* global __dirname */
/* global process */
/* global Buffer */

var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    chalk = require('chalk'),
    bodyParser = require('body-parser'),
    external = require('external-ip')(),
    passport = require('passport'),
    WindowsStrategy = require('passport-windowsauth'),
    ip = require('ip'),
    _ = require('lodash'),
    ldapAuth = require('./secrets/ldapAuth'),
    mongodb = require('mongodb'),
    ideas = require('./ideas');

var db = new mongodb.Db('flintandsteel', new mongodb.Server('localhost', 27017));

db.open(function(err, db) {
    db.createCollection('ideas', function(errIdea, collectionIdea) {
        if(errIdea) {
            console.log(errIdea);
        }
        else {
            db.createCollection('users', function(errUsers, collectionUsers) {
                if (errUsers) {
                    console.log(errUsers);
                }
                else {
                    collectionUsers.insert({ "myUser": "Test Testerson III" });
                    db.createCollection('events', function(errUsers, collectionUsers) {
                        if (errUsers) {
                            console.log(errUsers);
                        }
                        else {
                            db.close();        
                        }
                    }
                }
            });
        }
    });
});

var IdeasInstance = ideas.getInstance();

var app = express();

function startSees(res) {
    "use strict";

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'identity'
    });
    res.write("\n");

    return function sendSse(name, data, id) {
        res.write("event: " + name + "\n");
        if (id) {
            res.write("id: " + id + "\n");
        }
        res.write("data: " + JSON.stringify(data) + "\n\n");
    };
}

app.use(morgan(':remote-addr - ' +
    chalk.cyan('[:date] ') +
    chalk.green('":method :url ') +
    chalk.gray('HTTP/:http-version" ') +
    chalk.yellow(':status ') +
    ':res[content-length] ' +
    chalk.gray('":referrer" ":user-agent" ') +
    'time=:response-time ms'
));
app.use(express.static(path.join(__dirname + '/../src')));
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(new WindowsStrategy(ldapAuth.config, function(profile, done) {
    "use strict";
    if (profile) {
        done(null, profile);
    }
    else {
        done(null, false, "Invalid Credentials");
    }
}));

passport.serializeUser(function(user, done) {
    "use strict";
    console.log('serializeUser: ' + user.id);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    "use strict";
    if (id) {
        done(null);
    }
});

app.post('/login', function handleAuthentication(req, res, next) {
    "use strict";
    req.body.password = new Buffer(req.body.password, "base64").toString("ascii");
    passport.authenticate('WindowsAuthentication', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(200).json({
                status: 'AUTH_ERROR',
                id: undefined,
                username: undefined,
                name: undefined
            });
        }

        req.login(user, function(err) {
            if (err) {
                return res.status(200).json({
                    status: 'AUTH_ERROR',
                    id: undefined,
                    username: undefined,
                    name: undefined
                });
            }
            db.open(function(err, db) {
                if (err) {
                    console.log(err);
                }
                else {
                    db.collection('users').insertOne({
                            "username": user._json.sAMAccountName,
                            "accountId": user.id,
                            "email": user._json.mail,
                            "full": user.displayName,
                            "first": user._json.givenName,
                            "last": user._json.sn,
                            "nick": user._json.cn,
                            "likedIdeas": []
                        },
                        function(err, collection) {
                            if (err) {
                                console.log(chalk.bgRed(err));
                                return res.status(200).json({
                                    status: 'AUTH_ERROR',
                                    id: undefined,
                                    username: undefined,
                                    name: undefined
                                });
                            }
                            else {
                                console.log(chalk.bgGreen('User %s created in the users collection.'), user.displayName);
                                return res.status(200).json({
                                    status: 'AUTH_OK',
                                    id: user.id,
                                    username: user._json.sAMAccountName,
                                    email: user._json.mail,
                                    name: user.displayName,
                                    likedIdeas: []
                                });
                            }
                            db.close();
                        });
                    });
                    
            );
        });
    })(req, res, next);
});
app.post('/idea', function(req, res) {
    "use strict";

    ideas.create(
        req.body.id,
        req.body.title,
        req.body.description,
        req.body.author,
        req.body.likes,
        req.body.comments,
        req.body.backs,
        function(err, doc) {
            if (err) {
                console.log(chalk.bgRed(err));
            }
            else {
                console.log(chalk.bgGreen('Document with key %s stored in ideas.'), doc.key);
                ideas.fetch(function(err, headers) {
                    IdeasInstance.newHeaders(headers);
                });
            }
        }
    );
    res.sendStatus(201);
});
app.post('/updateidea', function(req, res) {
    "use strict";

    ideas.update(req.body.id, req.body.property, req.body.value, function(err) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            ideas.get(req.body.id, function(err, idea) {
                IdeasInstance.updateIdea(idea);
            });
            ideas.fetch(function(err, headers) {
                IdeasInstance.newHeaders(headers);
            });
            res.sendStatus(200);
        }
    });
});
app.post('/deleteidea', function(req, res) {
    "use strict";

    ideas.delete(req.body.id, function(err) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            ideas.get(req.body.id, function(/* err, idea */) {
                IdeasInstance.updateIdea(null, req.body.id);
            });
            ideas.fetch(function(err, headers) {
                IdeasInstance.newHeaders(headers);
            });
            res.sendStatus(200);
        }
    });
});
app.post('/updateaccount', function(req, res) {
    "use strict";

    // This will probably become an every login thing with LDAP anyway.
    db.collection('users').updateOne(
        { _id: req.body._id },
        { $set: req.body.userObject },
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
            }
            else {
                console.log(chalk.bgGreen('Document with id %s updated in the database.'), req.body._id);
                res.sendStatus(200);
            }
        }
    };
});

app.get('/idea', function(req, res) {
    "use strict";

    ideas.get(req.query.id, function(err, idea) {
        if (err) {
            res.status(200).send('IDEA_NOT_FOUND');
        }
        else {
            res.status(200).json(idea);
        }
    });
});
app.get('/idea/:id/events', function(req, res) {
    "use strict";

    var sse = startSees(res);

    function updateIdea(idea) {
        sse("updateIdea_" + req.params.id, idea, req.params.id);
    }

    IdeasInstance.on("updateIdea_" + req.params.id, updateIdea);

    req.on("close", function() {
        IdeasInstance.removeListener("updateIdea_" + req.params.id, updateIdea);
    });
});
app.get('/ideaheaders', function(req, res) {
    "use strict";

    ideas.fetch(function(err, headers) {
        if (err) {
            res.sendStatus(500);
        }
        else if (headers.length === 0) {
            res.status(200).send('NO_IDEAS_IN_STORAGE');
        }
        else {
            res.status(200).json(headers);
        }
    });
});
app.get('/ideaheaders/events', function(req, res) {
    "use strict";

    var sse = startSees(res);

    function updateHeaders(headers) {
        sse("newHeaders", headers);
    }

    IdeasInstance.on("newHeaders", updateHeaders);

    req.on("close", function() {
        IdeasInstance.removeListener("newHeaders", updateHeaders);
    });
});
app.get('/uniqueid', function(req, res) {
    "use strict";

});
app.get('/isuniqueuser', function(req, res) {
    "use strict";

});

external(function(err, ipExternal) {
    "use strict";

    if (err) {
        console.log(
            chalk.red('Could not determine network status, server running in local-only mode') +
            '\nServer listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:8080')
        );
    }
    else {
        console.log(
            'Server listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:8080') +
            '\n\tnetwork:  ' + chalk.magenta('http://') + chalk.magenta(ip.address()) + chalk.magenta(':8080') +
            '\n\tExternal: ' + chalk.magenta('http://') + chalk.magenta(ipExternal) + chalk.magenta(':8080') +
            '\n\tExternal access requires port 8080 to be configured properly.'
        );
    }
});

app.listen(process.argv[2] || 8080);
