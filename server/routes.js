/* global module */
/* global process */
/* global Buffer */
/* global GLOBAL */

module.exports = function(app) {
    "use strict";

    var module = {};

    var users = require('./users/users')(GLOBAL.db),
        ideas = require('./ideas/ideas')(GLOBAL.db),
        comments = require('./comments/comments')(GLOBAL.db),
        replaceIds = require('./replaceIds')(GLOBAL.db),
        chalk = require('chalk'),
        passport = require('passport');

    var IdeasInstance = ideas.getInstance();

    function startSees(res) {
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

    app.post('/login', function handleAuthentication(req, res, next) {
        if (process.env.NODE_ENV !== 'production') {
            if (new Buffer(req.body.password, "base64").toString() === 'test') {
                users.findForLogin(req.body.username, function(err, responseObj) {
                    if (err) {
                        console.error(chalk.bgRed(err));
                    }
                    res.status(200).json(responseObj);
                });
            }
            else {
                res.status(200).json(users.errResObj);
            }
        }
        else {
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
                        console.error(chalk.bgRed(err));
                        return res.status(200).json(users.errResObj);
                    }
                    else {
                        users.findForLogin(user, function(err, responseObj) {
                            if (err) {
                                console.error(chalk.bgRed(err));
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
        ideas.create(
            req.body.title,
            req.body.description,
            req.body.authorId,
            req.body.eventId,
            req.body.tags,
            req.body.rolesreq,
            function(err, doc) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    res.sendStatus(500);
                }
                else {
                    ideas.fetch(function(err, headers) {
                        IdeasInstance.newHeaders(headers);
                    });
                    res.status(201).json({_id: doc.insertedId, status: "Created"});
                }
            }
        );
    });
    app.post('/comment', function(req, res) {
        comments.create(
            req.body.parentId,
            req.body.text,
            req.body.authorId,
            function(err, doc) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    res.sendStatus(500);
                }
                else {
                    ideas.addComment(req.body.parentId, doc.insertedId, function(err) {
                        if (err) {
                            console.error(chalk.bgRed(err));
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
        comments.delete(req.body.commentId, function(err) {
            if (err) {
                console.error(chalk.bgRed(err));
                res.sendStatus(500);
            }
            else {
                ideas.removeComment(req.body.commentId, function(err, docId) {
                    if (err) {
                        console.error(chalk.bgRed(err));
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
        users.update(req.body._id, "likedIdeas", req.body.likedIdeas, function(err, results) {
            if (err || results.value === null) {
                console.error(chalk.bgRed(err));
            }
            else {
                res.sendStatus(200);
            }
        });
    });
    app.get('/user', function(req, res) {
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
        ideas.get(req.query.id, function(err, idea) {
            if (err) {
                res.status(200).send('IDEA_NOT_FOUND');
            }
            else {
                replaceIds.idea(idea, function(err, idea) {
                    if (err) {
                        console.error(chalk.bgRed(err));
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
        var sse = startSees(res);

        function updateIdea(idea) {
            if (idea === null) {
                sse("updateIdea_" + req.params.id, idea, req.params.id);
                return;
            }
            replaceIds.idea(idea, function(err, ideaData) {
                if (err) {
                    console.error(chalk.bgRed(err));
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
        ideas.fetch(function(err, headers) {
            if (err) {
                res.sendStatus(500);
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
        var sse = startSees(res);

        function updateHeaders(headers) {
            replaceIds.headers(headers, function(err, headersData) {
                if (err) {
                    console.error(chalk.bgRed(err));
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

    return module;
};
