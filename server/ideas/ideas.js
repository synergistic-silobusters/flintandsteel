/* global module */

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

    module.create = function(title, description, authorId, eventId, tags, rolesreq, cb) {
        var idea = IdeaModel.create(title, description, authorId, eventId, tags, rolesreq);
        db.insertOne(COLLECTION, idea, function(err, doc) {
            cb(err, doc);
        });
    };

    module.get = function(id, cb) {
        db.findOneById(COLLECTION, id, function(err, doc) {
            cb(err, doc);
        });
    };

    module.like = function(id, userId, cb) {
        var objId = new ObjectId(userId);

        var obj = {
            userId: objId
        };
        db.updateOnePushArray(COLLECTION, id, "likes", obj, cb);
    };

    module.unlike = function(id, userId, cb) {
        var objId = new ObjectId(userId);

        var obj = {
            userId: objId
        };

        db.updateOnePullArray(COLLECTION, id, "likes", obj, cb);
    };

    module.back = function(id, backObj, cb) {
        db.updateOnePushArray(COLLECTION, id, "backs", backObj, cb);
    };

    module.unback = function(id, userId, cb) {
        db.updateOnePullArray(COLLECTION, id, "backs", backObj, cb);
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

    module.edit = function(id, title, description, rolesreq, cb) {
        var now = new Date().toISOString();

        var editObj = {};
        editObj.title = title;
        editObj.description = description;
        editObj.rolesreq = rolesreq;
        editObj.timeModified = now;

        db.updateOne(COLLECTION, id, editObj, function(err, results) {
            cb(err, results);
        });
    };

    module.delete = function(id, cb) {
        db.deleteOne(COLLECTION, id, function(err, results) {
            cb(err, results);
        });
    };

    function getHeaders(cb) {
        var projection = {
            title: 1,
            description: 1,
            authorId: 1,
            likes: 1,
            backs: 1,
            team: 1,
            updates: 1
        };

        db.find(COLLECTION, projection, function(err, docs) {
            if (err) {
                cb(err);
            }
            else if (docs.length === 0) {
                cb(null, docs);
            }
            else {
                var headers = [];
                docs.forEach(function(doc) {
                    doc.abstract = _.take(_.words(doc.description), 20).join(' ');
                    doc.likes = doc.likes.length;
                    doc.backs = doc.backs.length;
                    doc.team = doc.team.length;
                    doc.updates = doc.updates.length;
                    headers.push(doc);
                });
                cb(null, headers);
            }
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
                ideaProto.emit("updateIdea_" + key, idea);
                isEmittingUpdates = false;
            }, 500);
        }
    };

    return module;
};
