/* global module */

module.exports = function(db) {
    "use strict";
    var module = {};

    var StatusModel = require('./statusModel');

    var COLLECTION = "statuses";

    module.create = function(parentId, text, authorId, cb) {
        var status = StatusModel.create(parentId, text, authorId);
        db.insertOne(COLLECTION, status, function(err, doc) {
            cb(err, doc);
        });
    };

    module.get = function(id, cb) {
        db.findOneById(COLLECTION, id, function(err, doc) {
            cb(err, doc);
        });
    };

    module.update = function(id, property, value, cb) {
        var now = new Date().toISOString();

        var updateObj = {};
        updateObj[property] = value;
        updateObj.timeModified = now;

        db.updateOne(COLLECTION, id, updateObj, function(err, results) {
            cb(err, results);
        });
    };

    module.delete = function(id, cb) {
        db.deleteOne(COLLECTION, id ,function(err, results) {
            cb(err, results);
        });
    };

    return module;
};
