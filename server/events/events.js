/* global module */

module.exports = function (db) {
    "use strict";
    var module = {};

    var EventModel = require('./eventModel');

    var COLLECTION = "events";

    exports.create = function(parentId, text, authorId, cb) {
        var event = EventModel.create(parentId, text, authorId);
        db.insertOne(COLLECTION, event, function(err, doc) {
            cb(err, doc);
        });
    };

    exports.get = function(id, cb) {
        db.findOneById(COLLECTION, id, function(err, doc) {
            cb(err, doc);
        });
    };

    exports.getAll = function(cb) {
        db.find(COLLECTION, {}, function(err, docs) {
            cb(err, docs);
        });
    }

    return module;
};
