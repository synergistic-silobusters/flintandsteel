/* global exports */
/* global process */

var CommentModel = require('./commentModel'),
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

exports.create = function(parentId, text, authorId, cb) {
    "use strict";
    var comment = CommentModel.create(parentId, text, authorId);
    db.collection('comments').insertOne(comment, function(err, doc) {
        if (err) {
            cb(err);
        }
        cb(null, doc);
    });
};

exports.get = function(id, cb) {
    "use strict";

    var objId = new ObjectId(id);

    db.collection('comments').findOne({_id: objId}, function(err, doc) {
        if (doc) {
            cb(null, doc);
        }
        else {
            cb("Document was not found in the database!");
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

    db.collection('comments').updateOne(
        { _id: objId },
        { $set: updateObj },
        function(err, results) {
            if (err) {
                console.log(chalk.bgRed(err));
                cb(err);
            }
            else {
                console.log(chalk.bgGreen('Document with id %s updated in the database.'), id);
                cb(null, results);
            }
        }
    );
};

exports.delete = function(id, cb) {
    "use strict";

    var objId = new ObjectId(id);

    db.collection('comments').deleteOne({ _id: objId },function(err, results) {
        if (err) {
            console.log(chalk.bgRed(err));
            cb(err);
        }
        else {
            console.log(chalk.bgGreen('Document with id %s removed from comments.'), id);
            cb(null, results);
        }
    });
};
