/* global require */
/* global module */
/* global process */

module.exports = function(db) {
    "use strict";

    var sha256 = require('sha.js')('sha256');
    var _ = require('lodash');
    var Promise = require('bluebird');
    var serverToken = 'uninitialized';
    var ObjectId = require('mongodb').ObjectId;

    function authorize(userId, token) {
        if (_.isString(userId)) {
            userId = new ObjectId(userId);
        }
        return db.collection('users').find(
            { _id: userId },
            { token: 1 }
        ).limit(1).next().then(function(user) {
            if (user === null) {
                return false;
            }
            return token === user.token;
        });
    }

    serverToken = sha256.update(new Date().toISOString() + process.argv[2]).digest('hex');

    db.collection('users').find({}, { email: 1 }).toArray().then(function(users) {
        var promises = [];
        _.forEach(users, function(user) {
            var userToken = sha256.update(serverToken + user._id + user.email).digest('hex');
            promises.push(db.collection('users').findOneAndUpdate(
                { _id: user._id },
                { $set: { token: userToken } }
            ));
        });
        return Promise.all(promises);
    }).then(function(results) {
        console.log(results.length + ' tokens were generated successfully.');
    }).catch(function(err) {
        console.log(err);
    });

    return {
        authorize: authorize
    };
};
