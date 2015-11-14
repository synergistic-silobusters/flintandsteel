/* global __dirname */
/* global process */
/* global Buffer */
/* global GLOBAL */

var dbName = 'flintandsteel';

if (process.env.NODE_ENV !== 'production') {
    dbName += "-dev";
}

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
    db = require('./db')(dbName),
    users = require('./users/users')(db),
    ideas = require('./ideas/ideas')(db),
    comments = require('./comments/comments')(db),
    replaceIds = require('./replaceIds')(db);

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

app.use(express.static(path.join(__dirname + '/../src')));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {

    app.use(morgan(':remote-addr - ' +
        chalk.cyan('[:date] ') +
        chalk.green('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        chalk.yellow(':status ') +
        ':res[content-length] ' +
        chalk.gray('":referrer" ":user-agent" ') +
        'time=:response-time ms'
    ));

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
            users.findForLogin(req.body.username, function(err, responseObj) {
                if (err) {
                    console.log(chalk.bgRed(err));
                }
                res.status(200).json(responseObj);
            });
        }
        else {
            res.status(200).json(users.errResObj);
        }
    }
    else if (process.env.NODE_ENV === 'production') {
        req.body.password = new Buffer(req.body.password, "base64").toString("ascii");
        passport.authenticate('WindowsAuthentication', function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(200).json(users.errResObj);
            }

            req.login(user, function(err) {
                if (err) {
                    console.log(err);
                    return res.status(200).json(users.errResObj);
                }
                else {
                    users.findForLogin(user._json, function(err, responseObj) {
                        if (err) {
                            console.log(err);
                            return res.status(200).json(users.errResObj);
                        }
                        else {
                            return res.status(200).json(responseObj);
                        }
                    });
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
        req.body.authorId,
        req.body.eventId,
        req.body.tags,
        req.body.rolesreq,
        function(err, doc) {
            if (err) {
                console.log(chalk.bgRed(err));
                res.sendStatus(500);
            }
            else {
                console.log(chalk.bgGreen('Document with id %s stored in ideas.'), doc.insertedId);
                ideas.fetch(function(err, headers) {
                    IdeasInstance.newHeaders(headers);
                });
                res.status(201).json({_id: doc.insertedId, status: "Created"});
            }
        }
    );
});
app.post('/comment', function(req, res) {
    "use strict";

    comments.create(
        req.body.parentId,
        req.body.text,
        req.body.authorId,
        function(err, doc) {
            if (err) {
                console.log(chalk.bgRed(err));
                res.sendStatus(500);
            }
            else {
                ideas.addComment(req.body.parentId, doc.insertedId, function(err) {
                    if (err) {
                        console.log(chalk.bgRed(err));
                        res.sendStatus(500);
                    }
                    else {
                        ideas.get(req.body.parentId, function(err, idea) {
                            IdeasInstance.updateIdea(idea);
                        });
                        res.status(201).json({_id: doc.insertedId, status: "Created"});
                    }
                });
            }
        }
    );
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
app.post('/editidea', function(req, res) {
    "use strict";

    ideas.edit(req.body.id, req.body.title, req.body.description, req.body.rolesreq, function(err) {
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
            IdeasInstance.updateIdea(null, req.body.id);
            ideas.fetch(function(err, headers) {
                IdeasInstance.newHeaders(headers);
            });
            res.sendStatus(200);
        }
    });
});
app.post('/deleteComment', function(req, res) {
    "use strict";

    comments.delete(req.body.commentId, function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else {
            ideas.removeComment(req.body.commentId, function(err, docId) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                else {
                    ideas.get(docId, function(err, idea) {
                        IdeasInstance.updateIdea(idea);
                    });
                    res.status(201).json({_id: docId, status: "Deleted"});
                }
            });
        }
    });
});
app.post('/updateaccount', function(req, res) {
    "use strict";

    users.update(req.body._id, "likedIdeas", req.body.likedIdeas, function(err, results) {
        if (err || results.value === null) {
            console.log(chalk.bgRed(err));
        }
        else {
            res.sendStatus(200);
        }
    });
});
app.get('/user', function(req, res) {
    "use strict";

    users.get(req.query.id, function(err, responseObj) {
        if (err) {
            res.status(200).send('USER_NOT_FOUND');
        }
        else {
            res.status(200).json(responseObj);
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
            replaceIds.idea(idea, function(err, idea) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.status(200).json(idea);
                }
            });
        }
    });
});
app.get('/comment', function(req, res) {
    "use strict";

    comments.get(req.query.id, function(err, comment) {
        if (err) {
            res.status(200).send('COMMENT_NOT_FOUND');
        }
        else {
            res.status(200).json(comment);
        }
    });
});
app.get('/idea/:id/events', function(req, res) {
    "use strict";

    var sse = startSees(res);

    function updateIdea(idea) {
        replaceIds.idea(idea, function(err, ideaData) {
            if (err) {
                console.log(err);
            }
            else {
                sse("updateIdea_" + req.params.id, ideaData, req.params.id);
            }
        });
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
            replaceIds.headers(headers, function(err, headersData) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.status(200).json(headersData);
                }
            });
        }
    });
});
app.get('/ideaheaders/events', function(req, res) {
    "use strict";

    var sse = startSees(res);

    function updateHeaders(headers) {
        replaceIds.headers(headers, function(err, headersData) {
            if (err) {
                console.log(err);
            }
            else {
                sse("newHeaders", headersData);
            }
        });
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
    app.listen(port);
}
else if (process.env.NODE_ENV === 'production') {
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
}
