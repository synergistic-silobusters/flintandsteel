/* global exports */
/* global process */

var Idea = require('./idea'),
    chalk = require('chalk'),
    mongodb = require('mongodb'),
    ObjectId = require('mongodb').ObjectID,
    MongoClient = mongodb.MongoClient,
    _ = require('lodash');

require('events').EventEmitter.prototype._maxListeners = 102;

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

var IdeasSingleton;

exports.create = function(title, description, author, likes, comments, backs, cb) {
    "use strict";
    var idea = Idea.create(title, description, author, likes, comments, backs);
    db.collection('ideas').insertOne(idea, function(err, doc) {
        if (err) {
            cb(err);
        }
        cb(null, doc);
    });
};

exports.get = function(id, cb) {
    "use strict";

    var objId = new ObjectId(id);

    db.collection('ideas').findOne({_id: objId}, function(err, doc) {
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

    var updateObj = {};
    updateObj[property] = value;
    var objId = new ObjectId(id);

    db.collection('ideas').updateOne(
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

    db.collection('ideas').deleteOne({ _id: objId },function(err, results) {
        if (err) {
            console.log(chalk.bgRed(err));
            cb(err);
        }
        else {
            console.log(chalk.bgGreen('Document with id %s removed from the database.'), id);
            cb(null, results);
        }
    });
};

function getHeaders(cb) {
    "use strict";

    // TODO: In between find() and toArray() we can put sort() with the fields
    // we want to sort by, eg. {title: 1}.
    db.collection('ideas').find({}, {title: 1, author: 1, likes: 1, description: 1 }).toArray(function(err, docs) {
        if (err) {
            cb(err);
        }
        else if (docs.length === 0) {
            cb(null, docs);
        }
        else {
            var headers = [];
            docs.forEach(function(doc) {
                doc.abstract = _.take(_.words(doc.description), 20).join(' ');
                doc.likes = doc.likes.length;
                headers.push(doc);
            });
            cb(null, headers);
        }
    });
}

exports.fetch = getHeaders;

function Ideas() {
    "use strict";

    if (IdeasSingleton) {
        return IdeasSingleton;
    }
    else {
        IdeasSingleton = this;
        return IdeasSingleton;
    }
}

exports.getInstance = function() {
    "use strict";

    return new Ideas();
};

require("util").inherits(Ideas, require("events").EventEmitter);

Ideas.prototype.newHeaders = function(headers) {
    "use strict";

    this.emit("newHeaders", headers);
};

Ideas.prototype.updateIdea = function(idea, oldKey) {
    "use strict";

    this.emit("updateIdea_" + oldKey || idea.key , idea);
};
