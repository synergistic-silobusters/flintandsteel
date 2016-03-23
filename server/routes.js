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
        ideaPostProcessing = require('./ideaPostProcessing')(db),
        chalk = require('chalk'),
        _ = require('lodash'),
        mongo = require('mongodb'),
        Promise = require('bluebird'),
        ObjectId = mongo.ObjectID,
        passport = require('passport'),
        Tokens = require('./tokens');

    var tokens = new Tokens();

    function processAuthorization(req, res, next) {
        if (req.headers.authorization) {
            var authorizationType = req.headers.authorization.split(' ')[0];
            var authorizationToken = req.headers.authorization.split(' ')[1];
            var userId = authorizationToken.split(':')[0];
            var authorizationId = authorizationToken.split(':')[1];
            tokens.authorize(db.getDb(), userId, authorizationId).then(function(result) {
                if (result && authorizationType === 'Bearer') {
                    next();
                }
                else {
                    var message = 'authorization token malformed';
                    if (!result) {
                        message = 'authorization rejected';
                    }
                    res.set('WWW-Authenticate', 'Bearer');
                    res.status(401).json({
                        status: 401,
                        message: message
                    });
                }
            });
        }
        else {
            res.set('WWW-Authenticate', 'Bearer');
            res.status(401).json({
                status: 401,
                message: 'authorization token not found.'
            });
        }
    }

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

    app.get('/api/v1/ideas', function(req, res) {
        ideas.fetch().then(function(headers) {
            return ideaPostProcessing.headers(headers);
        }).then(function(replacedHeaders) {
            var headersToSend = replacedHeaders.map(function(singleHeader) {
                return singleHeader[0];
            });
            res.status(200).json(headersToSend);
        })
        .catch(function(error) {
            res.status(500).json(error);
        });
    });

    app.post('/api/v1/ideas', processAuthorization, function(req, res) {
        ideas.create(
            req.body.title,
            req.body.description,
            new ObjectId(req.body.authorId),
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

    app.get('/api/v1/ideas/:id', function(req, res, next) {
        if (req.params.id === 'search') {
            next();
        }
        else {
            ideas.get(req.params.id)
            .then(function(doc) {
                return ideaPostProcessing.idea(doc);
            })
            .then(function(ideaToSend) {
                //send the idea to client side
                res.status(200).json(ideaToSend[0]);
            })
            .catch(function(error) {
                if (error.message === 'NOT_FOUND') {
                    res.status(404).send('IDEA_NOT_FOUND');
                }
                else {
                    console.error(chalk.bgRed(error));
                    res.sendStatus(500);
                }
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

            if (/comments/i.test(req.query.inpath)) {
                var key = 'authorId';
                query[key] = new ObjectId(req.query.forterm);
                theDatabase.collection('comments').find(query, { parentId: 1 }).toArray(function(err, comments) {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else {
                        var uniqParentIds = _.uniqBy(comments, function(obj) {
                            return obj.parentId.toString();
                        });

                        var ideaIds = [];

                        _.forEach(uniqParentIds, function(id) {
                            ideaIds.push(new ObjectId(id.parentId));
                        });

                        // TODO - This will break for nested comments.
                        theDatabase.collection('ideas').find(
                            { _id: { $in: ideaIds } },
                            projection
                        ).toArray(function(err, docs) {
                            if (err) {
                                res.sendStatus(500);
                            }
                            else {
                                res.status(200).json(docs);
                            }
                        });
                    }
                });
            }
            else {
                query[req.query.inpath] = /id/i.test(req.query.inpath) ? new ObjectId(req.query.forterm) : req.query.forterm;

                theDatabase.collection('ideas').find(query, projection).toArray(function(err, docs) {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else {
                        res.status(200).json(docs);
                    }
                });
            }
        }
    });

    app.delete('/api/v1/ideas/:id', processAuthorization, function(req, res) {
        ideas.delete(req.params.id).then(function() {
            res.sendStatus(204);
            return ideas.fetch();
        }).then(function(headers) {
            IdeasInstance.newHeaders(headers);
            IdeasInstance.updateIdea(null, req.params.id);
        }).catch(function(error) {
            console.error(chalk.bgRed(error));
            res.sendStatus(500);
        });
    });

    app.patch('/api/v1/ideas/:id', processAuthorization, function(req, res) {
        var promises = [];

        _.forEach(req.body, function(patchOp) {
            promises.push(db.patchObject('ideas', req.params.id, patchOp));
        });

        Promise.all(promises).then(function(results) {
            res.status(200).json(results);
            return Promise.all([
                ideas.get(req.params.id),
                ideas.fetch()
            ]);
        }).then(function(ideaResults) {
            //update idea with new values
            IdeasInstance.updateIdea(ideaResults[0]);
            IdeasInstance.newHeaders(ideaResults[1]);
        }).catch(function(error) {
            console.log(chalk.bgRed(error));
            res.sendStatus(500);
        });
    });

    app.get('/api/v1/users/:id', function(req, res) {
        users.get(req.params.id, true).then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            if (error.message === 'NOT_FOUND') {
                res.status(404).send('USER_NOT_FOUND');
            }
            else {
                res.sendStatus(500);
            }
        });
    });

    app.post('/api/v1/users/login', function(req, res, next) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        if (process.env.NODE_ENV !== 'production') {
            if (new Buffer(req.body.password, "base64").toString() === 'test') {
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
                                var token = tokens.generate({ _id: responseObj._id, email: responseObj.email });
                                users.update(responseObj._id, 'token', token, function(tokenError) {
                                    if (tokenError) {
                                        console.log(chalk.bgRed(tokenError));
                                        return res.status(500).json(tokenError);
                                    }
                                    else {
                                        responseObj.token = token;
                                        return res.status(200).json(responseObj);
                                    }
                                });
                            }
                        });
                    }
                });
            })(req, res, next);
        }
    });

    /*
    app.delete('/api/v1/users/:id', processAuthorization, function(req, res) {
        var promises = [], patchDelete = [
            { "operation": "modify", "path": "firstName", "value": "\"Deleted\"" },
            { "operation": "modify", "path": "lastName", "value": "\"User\"" },
            { "operation": "modify", "path": "fullName", "value": "\"Deleted User\"" },
            { "operation": "modify", "path": "username", "value": "\"deleted_user\"" },
            { "operation": "modify", "path": "email", "value": "\"deleted@deleted.com\"" },
            { "operation": "delete", "path": "nickname" },
            { "operation": "delete", "path": "title" },
            { "operation": "delete", "path": "token" }
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

    app.patch('/api/v1/users/:id', processAuthorization, function(req, res) {
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
    */


    app.get('/api/v1/events', function(req, res) {
        events.getAll().then(function(results) {
            res.status(200).json(results);
        }).catch(function(error) {
            console.log(error);
            res.senStatus(500);
        });
    });

    app.get('/api/v1/events/:id', function(req, res) {
        events.get(req.params.id).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            if (error.message === 'NOT_FOUND') {
                res.status(404).send('EVENT_NOT_FOUND');
            }
            else {
                console.error(chalk.bgRed(error));
                res.sendStatus(500);
            }
        });
    });

    app.post('/api/v1/events', processAuthorization, function(req, res) {
        events.create(req.body.name, req.body.location, req.body.startDate, req.body.endDate).then(function(result) {
            res.status(201).json(result);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.delete('/api/v1/events/:id', processAuthorization, function(req, res) {
        db.deleteOne('events', req.params.id).then(function() {
            res.sendStatus(204);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.patch('/api/v1/events/:id', processAuthorization, function(req, res) {
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

    app.post('/api/v1/comments', processAuthorization, function(req, res) {
        Promise.all([
            ideas.get(req.body.parentId),
            comments.create(req.body.parentId, req.body.text, req.body.authorId)
        ]).then(function(results) {
            if (results[0] !== 'NOT_FOUND') {
                var patchComments = {
                    "operation": "append",
                    "path": "comments",
                    "value": "{ \"commentId\": \"" + new ObjectId(results[1]._id) + "\"}"
                };
                return db.patchObject('ideas', results[0]._id, patchComments);
            }
            else {
                return new Promise(function(resolve) {
                    resolve(results[1]);
                });
            }
        }).then(function(opResult) {
            res.status(201).json(opResult);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.patch('/api/v1/comments/:id', processAuthorization, function(req, res) {
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

    app.delete('/api/v1/comments/:id', processAuthorization, function(req, res) {
        comments.get(req.params.id).then(function(commentToDelete) {
            return ideas.get(commentToDelete.parentId);
        }).then(function(idea) {
            if (idea !== 'NOT_FOUND') {
                var patchComments = {
                    "operation": "delete",
                    "path": "comments" + "/" + req.params.id
                };
                return db.patchObject('ideas', idea._id, patchComments);
            }
            else {
                return new Promise(function(resolve) {
                    resolve();
                });
            }
        }).then(function() {
            res.sendStatus(204);
            return comments.delete(req.params.id);
        }).then(function(deleteResults) {
            console.log(deleteResults);
        }).catch(function(error) {
            console.log(error);
            res.sendStatus(500);
        });
    });

    app.get('/sse/ideas', function(req, res) {
        var sse = startSees(res);

        function updateHeaders(headers) {
            // If the last idea is deleted, we send an empty array of headers.
            if (!headers) {
                var headersToSend = [];
                sse("newHeaders", headersToSend);
            }
            // Otherwise, we process the headers and send the results.
            else {
                ideaPostProcessing.headers(headers).then(function(headersData) {
                    var headersToSend = headersData.map(function(singleHeader) {
                        return singleHeader[0];
                    });
                    sse("newHeaders", headersToSend);
                }).catch(function(err) {
                    console.error(chalk.bgRed(err));
                });
            }
        }

        IdeasInstance.on("newHeaders", updateHeaders);

        req.on("close", function() {
            IdeasInstance.removeListener("newHeaders", updateHeaders);
        });
    });

    app.get('/sse/ideas/:id', function(req, res) {
        var sse = startSees(res);

        function updateIdea(idea) {
            if (/NOT_FOUND/.test(idea)) {
                sse("updateIdea_" + req.params.id, idea, req.params.id);
                return;
            }
            ideaPostProcessing.idea(idea).then(function(ideaData) {
                sse("updateIdea_" + req.params.id, ideaData[0], req.params.id);
            }).catch(function(err) {
                // TODO: This ends up running since ideaData[0] isn't defined here.
                console.error(chalk.bgRed(err));
            });
        }

        IdeasInstance.on("updateIdea_" + req.params.id, updateIdea);

        req.on("close", function() {
            IdeasInstance.removeListener("updateIdea_" + req.params.id, updateIdea);
        });
    });

    return module;
};
