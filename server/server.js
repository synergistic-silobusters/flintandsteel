/* global __dirname */
/* global process */
/* global Buffer */

var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    chalk = require('chalk'),
    datastore = require('docstore'),
    bodyParser = require('body-parser'),
    external = require('external-ip')(),
    passport = require('passport'),
    WindowsStrategy = require('passport-windowsauth'),
    ip = require('ip'),
    _ = require('lodash'),
    ideas = require('./ideas'),
    ldapAuth = require('./secrets/ldapAuth');

var userDb, ideasDb;

var IdeasInstance = ideas.getInstance();

var port = process.env.PORT_HTTP || process.argv[2] || 8080;

datastore.open('./server/datastore/users', function(err, store) {
    "use strict";

    if (err) {
        console.log(err);
    }
    else {
        userDb = store;
    }
});

datastore.open('./server/datastore/ideas', function(err, store) {
    "use strict";

    if (err) {
        console.log(err);
    }
    else {
        ideasDb = store;
    }
});

var app = express();

// Datastore filter to find everything
var filter = function dbFilter() {
    "use strict";

    return true;
};

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

        /*
        NOTE - Yash - 10/24/2015
        This is super crude but it'll be temporary. We can have our dummy users in mongo
        once that is implemented so that we can just query the server instead of...this.

        It'll also provide more configurabilty for our users.
         */

        if (req.body.username === 'test' && new Buffer(req.body.password, "base64").toString() === 'test') {
            res.status(200).json({
                status: 'AUTH_OK',
                id: 'test_user_id',
                username: req.body.username,
                email: 'test@testersoninc.com',
                name: 'Guybrush Threepwood',
                likedIdeas: []
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
                    return res.status(200).json({
                        status: 'AUTH_ERROR',
                        id: undefined,
                        username: undefined,
                        name: undefined
                    });
                }
                userDb.save(
                    {
                        key: user._json.sAMAccountName,
                        _id: user._json.sAMAccountName,
                        username: user._json.sAMAccountName,
                        accountId: user.id,
                        email: user._json.mail,
                        full: user.displayName,
                        first: user._json.givenName,
                        last: user._json.sn,
                        nick: user._json.cn,
                        likedIdeas: []
                    },
                    function(err, doc) {
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
                            console.log(chalk.bgGreen('Document with key %s stored in users.'), doc.key);
                            return res.status(200).json({
                                status: 'AUTH_OK',
                                id: doc.accountId,
                                username: doc.key,
                                email: doc.email,
                                name: doc.full,
                                likedIdeas: doc.likedIdeas
                            });
                        }
                    }
                );
            });
        })(req, res, next);
    }
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

    userDb.get(req.body.username, function(err, doc) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            _.assign(doc, req.body);
            doc.status = undefined;
            doc.id = undefined;
            userDb.save(doc, function(err, doc) {
                if (err) {
                    console.log(chalk.bgRed(err));
                }
                else {
                    console.log(chalk.bgGreen('Document with key %s updated in account.'), doc.key);
                    res.sendStatus(200);
                }
            });
        }
    });
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

    var dbToSearch,
        propName = '';
    if (req.query.for === 'idea') {
        dbToSearch = ideasDb;
        propName = 'ideaId';
    }
    else if (req.query.for === 'user') {
        dbToSearch = userDb;
        propName = 'accountId';
    }
    if (dbToSearch) {
        dbToSearch.scan(filter, function(err, docs) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                var listofIds = [], id = 0;
                var matcher = function matcher(item) {
                    return item === id;
                };
                for (var i = 0; i < docs.length; i++) {
                    listofIds.push(docs[i][propName]);
                }
                while (_.findIndex(listofIds, matcher) !== -1) {
                    id++;
                }
                res.status(200).json(id);
            }
        });
    }
});
app.get('/isuniqueuser', function(req, res) {
    "use strict";

    userDb.scan(filter, function(err, docs) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            var userFound = false;
            for (var i = 0; i < docs.length; i++) {
                userFound = (docs[i].username === req.query.user);
                if (userFound) {
                    break;
                }
            }
            res.status(200).json(!userFound);
        }
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
}
else if (process.env.NODE_ENV === 'production') {
    console.log('Server running in ' + chalk.cyan('production') + ' mode.');
}

app.listen(port);
