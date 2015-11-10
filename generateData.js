var chalk = require('chalk'),
    mongodb = require('mongodb'),
    Idea = require('./server/idea');

var DB = new mongodb.Db('flintandsteel-dev', new mongodb.Server('localhost', 27017));

DB.open(function(err, db) {
    "use strict";

    db.createCollection('users', function(errUsers) {
        if (errUsers) {
            console.log(errUsers);
        }
        else {
            var userObjs = [
                {
                    "username": "test1",
                    "accountId": "test_user_id1",
                    "email": "test@test.com",
                    "full": "Guybrush Threepwood",
                    "first": "Guybrush",
                    "last": "Threepwood",
                    "nick": "Threepy",
                    "likedIdeas": []
                },
                {
                    "username": "test2",
                    "accountId": "test_user_id2",
                    "email": "test@test.com",
                    "full": "Rick Sanchez",
                    "first": "Rick",
                    "last": "Sanchez",
                    "nick": "Dirty",
                    "likedIdeas": []
                },
                {
                    "username": "test3",
                    "accountId": "test_user_id3",
                    "email": "test@test.com",
                    "full": "Dick Dickerson",
                    "first": "Dick",
                    "last": "Dickerson",
                    "nick": "The Fracker",
                    "likedIdeas": []
                }
            ];

            db.collection('users').insert(userObjs,
                function(err, results) {
                    if (err) {
                        console.log(chalk.bgRed(err));
                        return;
                    }
                    else {
                        console.log(chalk.bgGreen('Users created in the users collection.'));
                    }
                }
            );
            db.createCollection('ideas', function(errIdea) {
                if (errIdea) {
                    console.log(errIdea);
                }
                else {
                    var ideaObjs = [];
                    ideaObjs.push(Idea.create("Guybrush's Test Idea", "This is an idea description.", "Guybrush Threepwood", [], [], []));
                    ideaObjs.push(Idea.create("Rick's Test Idea", "This is Mr. Sanchez\'s brilliant idea.", "Rick Sanchez", [], [], []));
                    ideaObjs.push(Idea.create("Dick's Test Idea", "This is \"The Fracker\'s\" master plan.", "Dick Dickerson", [], [], []));
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
                    db.createCollection('events', function(errUsers) {
                        if (errUsers) {
                            console.log(errUsers);
                        }
                        else {
                            db.close();
                        }
                    });
                }
            });
        }
    });
});
