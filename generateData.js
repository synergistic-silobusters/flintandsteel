var chalk = require('chalk'),
    mongodb = require('mongodb'),
    IdeaModel = require('./server/ideaModel'),
    UserModel = require('./server/userModel');

var DB = new mongodb.Db('flintandsteel-dev', new mongodb.Server('localhost', 27017));

DB.open(function(err, db) {
    "use strict";

    db.createCollection('users', function(errUsers) {
        if (errUsers) {
            console.log(errUsers);
        }
        else {
            var userObjs = [];
            userObjs.push(UserModel.create("Guybrush", "Threepwood", "Guybrush Threepwood", "test1", "test1@test.com", "Threepy", "Hippy Lumberjack"));
            userObjs.push(UserModel.create("Rick", "Sanchez", "Rick Sanchez", "test2", "test2@test.com", "Dirty", "Street Pharmacist"));
            userObjs.push(UserModel.create("Dick", "Dickerson", "Dick Dickerson", "test3", "test3@test.com", "The Fracker", "Money Bags Oil Man"));
            var insertedIds;
            db.collection('users').insert(userObjs,
                function(err, results) {
                    if (err) {
                        console.log(chalk.bgRed(err));
                        return;
                    }
                    else {
                        console.log(chalk.bgGreen('Users created in the users collection.'));
                        insertedIds = results.insertedIds;
                    }
                }
            );
            db.createCollection('ideas', function(errIdea) {
                if (errIdea) {
                    console.log(errIdea);
                }
                else {
                    var ideaObjs = [];
                    ideaObjs.push(IdeaModel.create("Guybrush's Test Idea", "This is an idea description.", insertedIds[0], [], [], []));
                    ideaObjs.push(IdeaModel.create("Rick's Test Idea", "This is Mr. Sanchez\'s brilliant idea.", insertedIds[1], [], [], []));
                    ideaObjs.push(IdeaModel.create("Dick's Test Idea", "This is \"The Fracker\'s\" master plan.", insertedIds[2], [], [], []));
                    console.log(ideaObjs.length);
                    db.collection('ideas').insert(ideaObjs,
                        function(err, results) {
                            if (err) {
                                console.log(chalk.bgRed(err));
                                return;
                            }
                            else {
                                console.log(chalk.bgGreen('Ideas created in the ideas collection.'));
                            }
                        }
                    );
                    db.createCollection('comments', function(errComments) {
                        if (errComments) {
                            console.log(errComments);
                        }
                        else {
                          db.createCollection('events', function(errEvents) {
                              if (errUsers) {
                                  console.log(errEvents);
                              }
                              else {
                                  db.close();
                              }
                          });
                        }
                    });
                }
            });
        }
    });
});
