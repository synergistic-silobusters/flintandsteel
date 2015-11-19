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

    module.get = function(id, cb) {
        db.findOneById(COLLECTION, id, function(err, doc) {
            cb(err, doc);
        });
    };

    module.getAll = function(cb) {
        db.find(COLLECTION, {}, function(err, docs) {
            cb(err, docs);
        });
    };

    return module;
};
