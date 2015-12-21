/* global module */

module.exports = function(db) {
    "use strict";
    var module = {};

    var EventModel = require('./eventModel');

    var COLLECTION = "events";

    module.create = function(parentId, text, authorId, cb) {
        var event = EventModel.create(parentId, text, authorId);
        db.insertOne(COLLECTION, event, function(err, doc) {
            cb(err, doc);
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

    module.getAll = function() {
        return new Promise(function(resolve, reject) {
            db.find(COLLECTION, {}, function(err, docs) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(docs);
                }
            });
        });
    };

    return module;
};
