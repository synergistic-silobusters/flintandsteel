/* global __dirname */
/* global process */
/* global Buffer */

var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    chalk = require('chalk'),
    bodyParser = require('body-parser'),
    external = require('external-ip')(),
    fs = require('fs'),
    passport = require('passport'),
    WindowsStrategy = require('passport-windowsauth'),
    ip = require('ip'),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    ideas = require('./ideas');

var DB;
var db;
if (process.env.NODE_ENV === 'development') {
    DB = new mongodb.Db('flintandsteel-dev', new mongodb.Server('localhost', 27017));
}
else if (process.env.NODE_ENV === 'production') {
    DB = new mongodb.Db('flintandsteel', new mongodb.Server('localhost', 27017));
}

DB.open(function(err, db) {
    "use strict";

    db.createCollection('ideas', function(errIdea) {
        if (errIdea) {
            console.log(errIdea);
        }
        else {
            db.createCollection('users', function(errUsers) {
                if (errUsers) {
                    console.log(errUsers);
                }
                else {
                    db.createCollection('events', function(errUsers) {
                        if (errUsers) {
                            console.log(errUsers);
                        }
                        else {
                            db.close();
                        }
                    });
                }
            });
        }
    });
});

var IdeasInstance = ideas.getInstance();

var port = process.env.PORT_HTTP || process.argv[2] || 8080;

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

if (process.env.NODE_ENV === 'production') {

    app.use(passport.initialize());

    passport.use(new WindowsStrategy(require('./secrets/ldapAuth').config, function(profile, done) {
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
        //TODO: Not sure what this is or why we need it, but we'll do it later.
        // db.users.findById(id, function(err, user){
        //     console.log(user);
        //     if (!err) {
        //         done(null, user);
        //     }
        //     else {
        //         done(err, null);
        //     }
        // });
    });
}

app.post('/login', function handleAuthentication(req, res, next) {
    "use strict";
    if (process.env.NODE_ENV === 'development') {
        if (new Buffer(req.body.password, "base64").toString() === 'test') {
            db.collection('users').find({username: req.body.username}).limit(1).toArray(function(err, docs) {
                if (docs.length === 1) {
                    res.status(200).json({
                        status: 'AUTH_OK',
                        id: docs[0].accountId,
                        username: docs[0].username,
                        email: docs[0].email,
                        name: docs[0].full,
                        likedIdeas: docs[0].likedIdeas
                    });
                }
                else {
                    res.status(200).json({
                        status: 'AUTH_ERROR',
                        id: undefined,
                        username: undefined,
                        name: undefined
                    });
                }
            });
        }
        else {
            res.status(200).json({
                status: 'AUTH_ERROR',
                id: undefined,
                username: undefined,
                name: undefined
            });
        }
    }
    else if (process.env.NODE_ENV === 'production') {
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
                    console.log(err);
                    return res.status(200).json({
                        status: 'AUTH_ERROR',
                        id: undefined,
                        username: undefined,
                        name: undefined
                    });
                }
                else {
                    var cursor = db.collection('users').find({ email: user._json.mail }).limit(1);
                    var userObj = {
                        "username": user._json.sAMAccountName,
                        "accountId": user.id,
                        "email": user._json.mail,
                        "full": user.displayName,
                        "first": user._json.givenName,
                        "last": user._json.sn,
                        "nick": user._json.cn,
                        "likedIdeas": []
                    };
                    var responseObj = {
                        status: 'AUTH_OK',
                        id: user._id,
                        username: user._json.sAMAccountName,
                        email: user._json.mail,
                        name: user.displayName,
                        likedIdeas: []
                    };

                    if (cursor.count() !== 1) {
                        db.collection('users').insertOne(userObj,
                            function(err) {
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
                                    return res.status(200).json(responseObj);
                                }
                            }
                        );
                    }
                    else {
                        db.collection('users').updateOne(
                            { email: user._json.mail },
                            { $set: userObj },
                            function(err) {
                                if (err) {
                                    console.log(chalk.bgRed(err));
                                }
                                else {
                                    console.log(chalk.bgGreen('Document with email %s updated in the database.'), user._json.mail);
                                    return res.status(200).json(responseObj);
                                }
                            }
                        );
                    }
                }
            });
        })(req, res, next);
    }
});
app.post('/idea', function(req, res) {
    "use strict";

    ideas.create(
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
                console.log(chalk.bgGreen('Document with id %s stored in ideas.'), doc.insertedId);
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

    db.collection('users').findAndModify(
        { username: req.body.username },
        [],
        { $set: {likedIdeas: req.body.likedIdeas } },
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
            }
            else {
                console.log(chalk.bgGreen('Document with id %s updated in the database.'), results.value._id);
                res.sendStatus(200);
            }
        }
    );
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

external(function(err, ipExternal) {
    "use strict";

    if (err) {
        console.log(
            chalk.red('Could not determine network status, server running in local-only mode') +
            '\nServer listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:' + port)
        );
    }
    else {
        console.log(
            'Server listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:' + port) +
            '\n\tnetwork:  ' + chalk.magenta('http://') + chalk.magenta(ip.address()) + chalk.magenta(':' + port) +
            '\n\tExternal: ' + chalk.magenta('http://') + chalk.magenta(ipExternal) + chalk.magenta(':' + port) +
            '\n\tExternal access requires port ' + port + ' to be configured properly.'
        );
    }
});

if (process.env.NODE_ENV === 'development') {
    console.log('Server running in ' + chalk.cyan('development') + ' mode.');
    MongoClient.connect("mongodb://localhost:27017/flintandsteel-dev", function(err, database) {
        "use strict";
        db = database;
        app.listen(port);
    });
}
else if (process.env.NODE_ENV === 'production') {
    MongoClient.connect("mongodb://localhost:27017/flintandsteel", function(err, database) {
        "use strict";
        db = database;
        console.log('Server running in ' + chalk.cyan('production') + ' mode.');
        var https = require('https');
        var http = require('http');
        var options = {
            key: fs.readFileSync('./server/secrets/innovate.ra.rockwell.com.key'),
            cert: fs.readFileSync('./server/secrets/innovate.ra.rockwell.com.crt')
        };

        https.createServer(options, app).listen(443);

        http.createServer(function(req, res) {
            res.writeHead(302, { "Location": "https://" + req.headers.host + req.url });
            res.end();
        }).listen(80);
    });
}
