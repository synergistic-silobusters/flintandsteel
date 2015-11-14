/* global exports */
/* global process */

var UserModel = require('./userModel'),
    chalk = require('chalk'),
    mongodb = require('mongodb'),
    ObjectId = require('mongodb').ObjectID,
    MongoClient = mongodb.MongoClient;

var db;
if (process.env.NODE_ENV === 'development') {
    MongoClient.connect("mongodb://localhost:27017/flintandsteel-dev", function(err, database) {
        "use strict";
        db = database;
    });
}
else if (process.env.NODE_ENV === 'production') {
    MongoClient.connect("mongodb://localhost:27017/flintandsteel", function(err, database) {
        "use strict";
        db = database;
    });
}

function findUserUsingLDAP(ldap, cb) {
    "use strict";

    var user = UserModel.create(ldap);
    db.collection('users').findAndModify(
        { email: user.email },
        [],
        { $set: user },
        { upsert: true },
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
                cb(err);
            }
            else {
                console.log(chalk.bgGreen('Document with email %s updated in the database.'), user.email);
                if (results.value) {
                    user._id = results.value._id;
                }
                else {
                    user._id = results.upserted;
                }
                var responseObj = {
                    status: 'AUTH_OK',
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.fullName,
                    likedIdeas: []
                };
                cb(null, responseObj);
            }
        }
    );
}

function findUser(username, cb) {
    "use strict";

    db.collection('users').findOne({username: username}, function(err, doc) {
        if (err || doc === null) {
            cb(err, {
                status: 'AUTH_ERROR',
                id: undefined,
                username: undefined,
                name: undefined
            });
        }
        else {
            cb(null, {
                status: 'AUTH_OK',
                _id: doc._id,
                name: doc.fullName,
                username: doc.username,
                email: doc.email,
                likedIdeas: doc.likedIdeas
            });
        }
    });
}

var loginFn;

if (process.env.NODE_ENV === 'production') {
    loginFn = findUserUsingLDAP;
}
else {
    loginFn = findUser;
}

exports.findForLogin = loginFn;

exports.get = function(id, cb) {
    "use strict";

    var objId = new ObjectId(id);

    db.collection('users').findOne({_id: objId}, function(err, doc) {
        if (err || doc === null) {
            cb("User was not found in the database!");
        }
        else {
            var responseObj = {
                name: doc.fullName,
                mail: doc.email,
                username: doc.username
            };
            cb(null, responseObj);
        }
    });
};

exports.update = function(id, property, value, cb) {
    "use strict";

    var now = new Date().toISOString();

    var updateObj = {};
    updateObj[property] = value;
    updateObj.timeModified = now;
    var objId = new ObjectId(id);

    db.collection('users').updateOne(
        { _id: objId },
        { $set: updateObj },
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
                cb(err);
            }
            else {
                console.log(chalk.bgGreen('User with id %s updated in the database.'), id);
                cb(null, results);
            }
        }
    );
};
