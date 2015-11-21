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

DB.open(function(err, db) {
    "use strict";

    var userObjs = [];
    userObjs.push(UserModel.create("Guybrush", "Threepwood", "Guybrush Threepwood", "test1", "test1@test.com", "Threepy", "Hippy Lumberjack"));
    userObjs.push(UserModel.create("Rick", "Sanchez", "Rick Sanchez", "test2", "test2@test.com", "Dirty", "Street Pharmacist"));
    userObjs.push(UserModel.create("Dick", "Dickerson", "Dick Dickerson", "test3", "test3@test.com", "The Fracker", "Money Bags Oil Man"));
    var insertedUserIds;
    db.collection('users').insert(userObjs,
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
                return;
            }
            else {
                console.log(chalk.bgGreen('Users created in the users collection.'));
                insertedUserIds = results.insertedIds;
                var now = new Date();
                var eventObjs = [];
                eventObjs.push(EventModel.create("In Progress Event 1", "USMAY", now.toISOString(), getFollowingWeek(now).toISOString()));
                eventObjs.push(EventModel.create("In Progress Event 2", "USMKE", now.toISOString(), getFollowingWeek(now).toISOString()));
                eventObjs.push(EventModel.create("Completed Event 1", "USTWB", getPreviousWeek(getPreviousWeek(now)).toISOString(), getPreviousWeek(now).toISOString()));
                var insertedEventIds;
                db.collection('events').insert(eventObjs,
                    function(err, results) {
                        if (err) {
                            console.log(chalk.bgRed(err));
                            return;
                        }
                        else {
                            console.log(chalk.bgGreen('Events created in the events collection.'))
                            insertedEventIds = results.insertedIds;
                            var ideaObjs = [];
                            ideaObjs.push(IdeaModel.create("Guybrush's Test Idea", "This is an idea description.", insertedUserIds[0], insertedEventIds[0], [], []));
                            ideaObjs.push(IdeaModel.create("Rick's Test Idea", "This is Mr. Sanchez\'s brilliant idea.", insertedUserIds[1], insertedEventIds[1], [], []));
                            ideaObjs.push(IdeaModel.create("Dick's Test Idea", "This is \"The Fracker\'s\" master plan.", insertedUserIds[2], insertedEventIds[2], [], []));
                            db.collection('ideas').insert(ideaObjs,
                                function(err, results) {
                                    if (err) {
                                        console.log(chalk.bgRed(err));
                                        return;
                                    }
                                    else {
                                        console.log(chalk.bgGreen('Ideas created in the ideas collection.'));
                                        db.close();
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});
