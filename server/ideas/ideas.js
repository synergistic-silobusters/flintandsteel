/* global module */

var Promise = require('bluebird');

module.exports = function(db) {
    "use strict";

    var module = {};

    require('events').EventEmitter.prototype._maxListeners = 102;

    var IdeaModel = require('./ideaModel'),
        chalk = require('chalk'),
        _ = require('lodash');

    var COLLECTION = "ideas";
    var IdeasSingleton;

    module.create = function(title, description, authorId, eventId, tags, rolesreq, complexity) {
        var idea = IdeaModel.create(title, description, authorId, eventId, tags, rolesreq, complexity);
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
        return db.findOneById(COLLECTION, id);
    };

    module.delete = function(id) {
        return db.deleteOne(COLLECTION, id);
    };

    function getHeaders() {
        var projection = {
            title: 1,
            description: 1,
            authorId: 1,
            eventId: 1,
            likes: 1,
            backs: 1,
            tags: 1,
            team: 1,
            timeCreated: 1
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
                            eventId: doc.eventId,
                            abstract: _.take(_.words(doc.description), 20).join(' '),
                            likes: doc.likes.length,
                            backs: doc.backs.length,
                            tags: doc.tags,
                            team: doc.team.length,
                            timeCreated: doc.timeCreated
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
    var newestIdeas = [];
    Ideas.prototype.updateIdea = function(idea, oldKey) {
        var ideaProto = this, key;

        if (!idea && !oldKey || oldKey === 'undefined') {
            console.error(chalk.bgRed("No idea (arg1) with an _id or manual id (arg2)"));
        }

        if (!oldKey) {
            key = idea._id;
            newestIdeas[key] = idea;
        }
        else {
            key = oldKey;
            newestIdeas[oldKey] = 'IDEA_NOT_FOUND';
        }

        if (!isEmittingUpdates) {
            isEmittingUpdates = true;
            setTimeout(function() {
                ideaProto.emit("updateIdea_" + key, newestIdeas[key]);
                isEmittingUpdates = false;
            }, 500);
        }
    };

    return module;
};
