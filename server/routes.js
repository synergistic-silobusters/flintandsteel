/* global module */
/* global process */
/* global Buffer */


module.exports = function(app, db) {
    "use strict";

    var module = {};

    var ideas = require('./ideas/ideas')(db),
        users = require('./users/users')(db),
        events = require('./events/events')(db),
        comments = require('./comments/comments')(db),
        replaceIds = require('./replaceIds')(db),
        chalk = require('chalk'),
        _ = require('lodash'),
        mongo = require('mongodb'),
        Promise = require('bluebird'),
        ObjectId = mongo.ObjectID,
        passport = require('passport');

    var IdeasInstance = ideas.getInstance();

    app.get('/ideas', function(req, res) {
        ideas.fetch().then(function(headers) {
            return replaceIds.headers(headers);
        }).then(function(replacedHeaders) {
            res.status(200).json(replacedHeaders);
        })
        .catch(function(error) {
            res.status(500).json(error);
        });
    });
    app.post('/ideas', function(req, res) {
        ideas.create(
            req.body.title,
            req.body.description,
            req.body.authorId,
            req.body.eventId,
            req.body.tags,
            req.body.rolesreq
        ).then(function(doc) {
            res.status(201).json({_id: doc.insertedId, status: "Created"});
            return ideas.fetch();
        }).then(function(headers) {
            IdeasInstance.newHeaders(headers);
        }).catch(function(error) {
            console.error(chalk.bgRed(error));
            res.sendStatus(500);
        });
    });

    app.get('/ideas/:id', function(req, res, next) {
        if (req.params.id === 'search') {
            next();
        }
        else {
            ideas.get(req.params.id).then(function(doc) {
                return replaceIds.idea(doc);
            }).then(function(result) {
                res.status(200).json(result[0]);
            })
            .catch(function(error) {
                console.error(chalk.bgRed(error));
                res.status(200).send('IDEA_NOT_FOUND');
            });
        }
    }, function(req, res) {
        if (!req.query.inpath || !req.query.forterm) {
            res.status(422).send('A query parameter is missing from the request.');
        }
        else {
            var query = {},
                projection = { title: 1, authorId: 1 },
                theDatabase = db.getDb();

            // jshint newcap:false
            query[req.query.inpath] = /id/i.test(req.query.inpath) ? ObjectId(req.query.forterm) : req.query.forterm;
            // jshint newcap:true

            theDatabase.collection('ideas').find(query, projection).toArray(function(err, docs) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.status(200).json(docs);
                }
            });
        }
    });

    app.delete('/ideas/:id', function(req, res) {
        ideas.delete(req.params.id).then(function() {
            res.sendStatus(204);
        }).catch(function(error) {
            console.error(chalk.bgRed(error));
            res.sendStatus(500);
        });
    });

    app.patch('/ideas/:id', function(req, res) {
        // console.log(req.body);
        var promises = [];

        _.forEach(req.body, function(patchOp) {
            promises.push(db.patchObject('ideas', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.get('/users/:id', function(req, res) {
        users.get(req.params.id, true).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            if (error === 'NO_USER') {
                res.status(404).send('Can\'t find that user :(');
            }
            else {
                res.sendStatus(500);
            }
        });
    });

    app.post('/users/login', function(req, res, next) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        if (process.env.NODE_ENV !== 'production') {
            if (req.body.password === 'test') {
                users.findForLogin(req.body.username).then(function(responseObj) {  
                    res.status(200).json(responseObj);
                }).catch(function(err) {
                    console.error(chalk.bgRed(err));
                    res.sendStatus(500);
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

    app.delete('/users/:id', function(req, res) {
        var promises = [], patchDelete = [
            { "operation": "modify", "path": "firstName", "value": "\"Deleted\"" },
            { "operation": "modify", "path": "lastName", "value": "\"User\"" },
            { "operation": "modify", "path": "fullName", "value": "\"Deleted User\"" },
            { "operation": "modify", "path": "username", "value": "\"deleted_user\"" },
            { "operation": "modify", "path": "email", "value": "\"deleted@deleted.com\"" },
            { "operation": "delete", "path": "nickname" },
            { "operation": "delete", "path": "title" }
        ];

        _.forEach(patchDelete, function(patchOp) {
            promises.push(db.patchObject('users', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json({ message: 'User marked deleted.', opResults: results });
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.patch('/users/:id', function(req, res) {
        var promises = [];

        _.forEach(req.body, function(patchOp) {
            promises.push(db.patchObject('users', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.get('/events', function(req, res) {
        events.getAll().then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.senStatus(500);
        });
    });

    app.get('/events/:id', function(req, res) {
        events.get(req.params.id).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.post('/events', function(req, res) {
        events.create(req.body.name, req.body.location, req.body.startDate, req.body.endDate).then(function(result) {
            res.status(201).json(result);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.delete('/events/:id', function(req, res) {
        db.deleteOne('events', req.params.id).then(function() {
            res.sendStatus(204);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.patch('/events/:id', function(req, res) {
        var promises = [];

        _.forEach(req.body, function(patchOp) {
            promises.push(db.patchObject('events', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.post('/comments', function(req, res) {
        comments.create(req.body.parentId, req.body.text, req.body.authorId).then(function(comment) {
            db.findOneById('ideas', req.body.parentId).then(function() {
                var patchComments = { 
                    "operation": "append",
                    "path": "comments",
                    "value": "{ \"commentId\": \"" + new ObjectId(comment._id) + "\"}"
                };
                return db.patchObject('ideas', req.body.parentId, patchComments);
            }).then(function(result) {
                res.status(201).json(result);
            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.patch('/comments/:id', function(req, res) {
        var promises = [];

        _.forEach(req.body, function(patchOp) {
            promises.push(db.patchObject('comments', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    /*var users = require('./users/users')(GLOBAL.db),
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
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
    app.post('/idea/addinteraction', function(req, res) {
        ideas.addInteraction(req.body.id, req.body.interactionType, req.body.interactionObject, function(err) {
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
    app.post('/idea/removeinteraction', function(req, res) {
        ideas.removeInteraction(req.body.id, req.body.interactionType, req.body.interactionObject, function(err) {
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
    app.post('/idea/editback', function(req, res) {
        ideas.editBack(req.body.id, req.body.authorId, req.body.new, function(err) {
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
        ideas.edit(req.body.id, req.body.title, req.body.description, req.body.tags, req.body.rolesreq, function(err) {
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
    });*/

    return module;
};
