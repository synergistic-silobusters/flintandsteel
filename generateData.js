var chalk = require('chalk'),
    mongodb = require('mongodb'),
    ideas = require('server/ideas');

var DB = new mongodb.Db('flintandsteel-dev', new mongodb.Server('localhost', 27017));

DB.open(function(err, db) {
    "use strict";

    db.createCollection('users', function(errUsers) {
        if (errUsers) {
            console.log(errUsers);
        }
        else {
            DB.open(function(err, db) {
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
                        // db.close();
                    }
                );
            });
            db.createCollection('ideas', function(errIdea) {
                if (errIdea) {
                    console.log(errIdea);
                }
                else {
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
