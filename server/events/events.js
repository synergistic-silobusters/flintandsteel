/* global module */

module.exports = function(db) {
    "use strict";
    var module = {};

    var EventModel = require('./eventModel');

    var COLLECTION = "events";

    module.create = function(name, location, startDate, endDate) {
        return new Promise(function(resolve, reject) {    
            var event = EventModel.create(name, location, startDate, endDate);
            db.insertOne(COLLECTION, event, function(err, doc) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(doc);
                }
            });
        })
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
