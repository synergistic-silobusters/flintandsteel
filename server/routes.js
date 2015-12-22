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
                return new Promise(function(resolve, reject) {
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

    app.delete('/comments/:id', function(req, res) {
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
                return new Promise(function(resolve, reject) {
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

    return module;
};
