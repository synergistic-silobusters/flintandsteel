/* global module */

var Promise = require('bluebird');

module.exports = function(db) {
    "use strict";

    var module = {};

    require('events').EventEmitter.prototype._maxListeners = 102;

    var IdeaModel = require('./ideaModel'),
        ObjectId = require('mongodb').ObjectID,
        chalk = require('chalk'),
        _ = require('lodash');

    var COLLECTION = "ideas";
    var IdeasSingleton;

    module.create = function(title, description, authorId, eventId, tags, rolesreq) {
        var idea = IdeaModel.create(title, description, authorId, eventId, tags, rolesreq);
        return new Promise(function(resolve, reject) {
            db.insertOne(COLLECTION, idea, function(err, doc) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(doc);
                }
            });
        });
    };

    module.get = function(id) {
        return new Promise(function(resolve, reject) {
            db.findOneById(COLLECTION, id, function(err, doc) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(doc);
                }
            });
        });
    };

    module.addInteraction = function(id, interactionType, interactionObject, cb) {
        if (typeof interactionObject.userId !== "undefined") {
            interactionObject.userId = new ObjectId(interactionObject.userId);
        }

        if (typeof interactionObject.authorId !== "undefined") {
            interactionObject.authorId = new ObjectId(interactionObject.authorId);
        }

        db.updateOnePushArray(COLLECTION, id, interactionType, interactionObject, cb);
    };

    module.removeInteraction = function(id, interactionType, interactionObject, cb) {
        if (typeof interactionObject.userId !== "undefined") {
            interactionObject.userId = new ObjectId(interactionObject.userId);
        }

        if (typeof interactionObject.authorId !== "undefined") {
            interactionObject.authorId = new ObjectId(interactionObject.authorId);
        }

        db.updateOnePullArray(COLLECTION, id, interactionType, interactionObject, cb);
    };

    module.editBack = function(id, authorId, newBack, cb) {
        var objId = new ObjectId(authorId);
        newBack.authorId = new ObjectId(newBack.authorId);
        db.updateOneArrayElement(COLLECTION, id, "backs", "authorId", objId, newBack, cb);
    };

    module.update = function(id, property, value, cb) {
        var updateObj = {};
        updateObj[property] = value;

        db.updateOne(COLLECTION, id, updateObj, function(err, results) {
            cb(err, results);
        });
    };

    module.addComment = function(id, objectId, cb) {
        var obj = {
            commentId: objectId
        };

        db.updateOnePushArray(COLLECTION, id, "comments", obj, function(err, results) {
            cb(err, results);
        });
    };

    module.removeComment = function(commentId, cb) {
        var objId = new ObjectId(commentId);

        var obj = {
            commentId: objId
        };

        db.findAndPullArray(COLLECTION, "comments", obj, function(err, results) {
            cb(err, results);
        });
    };

    module.edit = function(id, title, description, tags, rolesreq, cb) {
        var now = new Date().toISOString();

        var editObj = {};
        editObj.title = title;
        editObj.description = description;
        editObj.tags = tags;
        editObj.rolesreq = rolesreq;
        editObj.timeModified = now;

        db.updateOne(COLLECTION, id, editObj, function(err, results) {
            cb(err, results);
        });
    };

    module.delete = function(id) {
        return db.deleteOne(COLLECTION, id);
    };

    function getHeaders() {
        var projection = {
            title: 1,
            description: 1,
            authorId: 1,
            likes: 1,
            backs: 1,
            tags: 1,
            team: 1
        };

        return new Promise(function(resolve, reject) {
            db.find(COLLECTION, projection, function(err, docs) {
                if (err) {
                    reject(err);
                }
                else if (docs.length === 0) {
                    resolve();
                }
                else {
                    var headers = [];
                    docs.forEach(function(doc) {
                        headers.push({
                            _id: doc._id,
                            title: doc.title,
                            authorId: doc.authorId,
                            abstract: _.take(_.words(doc.description), 20).join(' '),
                            likes: doc.likes.length,
                            backs: doc.backs.length
                        });
                    });
                    resolve(headers);
                }
            });
        });
    }

    module.fetch = getHeaders;

    function Ideas() {
        if (IdeasSingleton) {
            return IdeasSingleton;
        }
        else {
            IdeasSingleton = this;
            return IdeasSingleton;
        }
    }

    module.getInstance = function() {
        return new Ideas();
    };

    require("util").inherits(Ideas, require("events").EventEmitter);

    var isEmittingHeaders = false;
    var newestHeaders = null;
    Ideas.prototype.newHeaders = function(headers) {
        var ideaProto = this;

        newestHeaders = headers;

        if (!isEmittingHeaders) {
            isEmittingHeaders = true;
            setTimeout(function() {
                ideaProto.emit("newHeaders", newestHeaders);
                isEmittingHeaders = false;
            }, 500);
        }
    };

    var isEmittingUpdates = false;
    var newestIdea = null;
    Ideas.prototype.updateIdea = function(idea, oldKey) {
        var ideaProto = this;

        newestIdea = idea;

        var key;
        if (idea === null && oldKey === "undefined") {
            console.error(chalk.bgRed("No idea (arg1) with an _id or manual id (arg2)"));
        }
        if (typeof oldKey === "undefined") {
            key = idea._id;
        }
        else {
            key = oldKey;
        }

        if (!isEmittingUpdates) {
            isEmittingUpdates = true;
            setTimeout(function() {
                ideaProto.emit("updateIdea_" + key, newestIdea);
                isEmittingUpdates = false;
            }, 500);
        }
    };

    return module;
};
