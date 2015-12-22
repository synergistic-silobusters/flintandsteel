/* global module */

module.exports = function(db) {
    "use strict";
    var module = {};

    var EventModel = require('./eventModel'),
        Promise = require('bluebird');

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
        });
    };

    module.get = function(id) {
        return db.findOneById(COLLECTION, id);
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
