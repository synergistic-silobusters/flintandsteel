/* global exports */

"use strict";

var chalk = require('chalk'),
    mongodb = require('mongodb'),
    UserModel = require('./server/users/userModel'),
    IdeaModel = require('./server/ideas/ideaModel'),
    EventModel = require('./server/events/eventModel');

function getPreviousWeek(originalDate){
    var lastWeek = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() - 7);
    return lastWeek ;
}

function getFollowingWeek(originalDate){
    var nextWeek = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate() + 7);
    return nextWeek ;
}

var DB = new mongodb.Db('flintandsteel-dev', new mongodb.Server('localhost', 27017));

var userIds = [];
var eventIds = [];

exports.getUserIds = function getUserIds() {
    return userIds;
};

exports.getEventIds = function getEventIds() {
    return eventIds;
};

exports.generateUsers = function generateUsers(cb) {
    DB.open(function(err, db) {
        var userObjs = [];
        userObjs.push(UserModel.create("Guybrush", "Threepwood", "Guybrush Threepwood", "test1", "test1@test.com", "Threepy", "Hippy Lumberjack"));
        userObjs.push(UserModel.create("Rick", "Sanchez", "Rick Sanchez", "test2", "test2@test.com", "Dirty", "Street Pharmacist"));
        userObjs.push(UserModel.create("Dick", "Dickerson", "Dick Dickerson", "test3", "test3@test.com", "The Fracker", "Money Bags Oil Man"));
        db.collection('users').insert(userObjs,
            function(err, results) {
                db.close();
                if (err) {
                    console.log(chalk.bgRed(err));
                    cb(err);
                    return;
                }
                else {
                    console.log(chalk.bgGreen('Users created in the users collection.'));
                    userIds = userIds.concat(results.insertedIds);
                    cb(null, userIds);
                }
            }
        );
    });
};

exports.generateEvents = function generateEvents(cb) {
    DB.open(function(err, db) {
        var now = new Date();
        var eventObjs = [];
        eventObjs.push(EventModel.create("In Progress Event 1", "USMAY", now.toISOString(), getFollowingWeek(now).toISOString()));
        eventObjs.push(EventModel.create("In Progress Event 2", "USMKE", now.toISOString(), getFollowingWeek(now).toISOString()));
        eventObjs.push(EventModel.create("Completed Event 1", "USTWB", getPreviousWeek(getPreviousWeek(now)).toISOString(), getPreviousWeek(now).toISOString()));
        db.collection('events').insert(eventObjs,
            function(err, results) {
                db.close();
                if (err) {
                    console.log(chalk.bgRed(err));
                    cb(err);
                    return;
                }
                else {
                    console.log(chalk.bgGreen('Events created in the events collection.'));
                    eventIds = eventIds.concat(results.insertedIds);
                    cb(null, eventIds);
                }
            }
        );
    });
};

exports.generateIdeas = function generateIdeas(cb) {
    DB.open(function(err, db) {
        var ideaObjs = [];
        ideaObjs.push(IdeaModel.create("Guybrush's Test Idea", "This is an idea description.", userIds[0], eventIds[0], [], []));
        ideaObjs.push(IdeaModel.create("Rick's Test Idea", "This is Mr. Sanchez\'s brilliant idea.", userIds[1], eventIds[1], [], []));
        ideaObjs.push(IdeaModel.create("Dick's Test Idea", "This is \"The Fracker\'s\" master plan.", userIds[2], eventIds[2], [], []));
        db.collection('ideas').insert(ideaObjs,
            function(err) {
                db.close();
                if (err) {
                    console.log(chalk.bgRed(err));
                    cb(err);
                    return;
                }
                else {
                    console.log(chalk.bgGreen('Ideas created in the ideas collection.'));
                    cb(null);
                }
            }
        );
    });
};

exports.generateAll = function generateAll(cb) {
    exports.generateUsers(function(err) {
        if (!err) {
            exports.generateEvents(function(err) {
                if (!err) {
                    exports.generateIdeas(function(err) {
                        cb(null);
                        return;
                    });
                }
                else {
                    cb(err);
                    return;
                }
            });
        }
        else {
            cb(err);
            return;
        }
    });
};
