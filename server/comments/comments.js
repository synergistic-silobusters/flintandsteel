/* global module */

module.exports = function(db) {
    "use strict";
    var module = {};

    var CommentModel = require('./commentModel'),
        Promise = require('bluebird');

    var COLLECTION = "comments";

    module.create = function(parentId, text, authorId) {
        return new Promise(function(resolve, reject) {
            var comment = CommentModel.create(parentId, text, authorId);
            db.insertOne(COLLECTION, comment, function(err, doc) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({_id: comment._id, result: doc});
                }
            });
        });
    };

    module.get = function(id) {
        return db.findOneById(COLLECTION, id);
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

    module.delete = function(id) {
        return new Promise(function(resolve, reject) {
            db.deleteOne(COLLECTION, id, function(err, results) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    };

    return module;
};
