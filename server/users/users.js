/* global module */
/* global process */

module.exports = function(db) {
    "use strict";

    var module = {};

    var UserModel = require('./userModel'),
        chalk = require('chalk');

    var COLLECTION = "users";

    module.errResObj = {
        status: 'AUTH_ERROR',
        id: undefined,
        username: undefined,
        name: undefined
    };

    function findUserUsingLDAP(ldap, cb) {
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
        db.findOneByProperty(COLLECTION, "username", username, function(err, doc) {
            if (err || doc === null) {
                cb(err, module.errResObj);
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

    module.findForLogin = loginFn;

    module.get = function(id, cb) {
        db.findOneById(COLLECTION, id, function(err, doc) {
            if (err || doc === null) {
                cb(err);
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

    module.update = function(id, property, value, cb) {
        var updateObj = {};
        updateObj[property] = value;

        db.updateOne(COLLECTION, id, updateObj, function(err, results) {
            cb(err, results);
        });
    };

    return module;
};
