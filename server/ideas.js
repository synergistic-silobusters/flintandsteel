/* global exports */

var Idea = require('./idea'),
    chalk = require('chalk'),
    mongodb = require('mongodb'),
    _ = require('lodash');

var db = new mongodb.Db('flintandsteel', new mongodb.Server('localhost', 27017));

var IdeasSingleton;

exports.create = function(id, title, description, author, likes, comments, backs, cb) {
    "use strict";

    var idea = Idea.create(id, title, description, author, likes, comments, backs);
    db.collection('ideas').insertOne(idea, function(err, doc) {
        if (err) {
            cb(err);
        }
        cb(null, doc);
        db.close();
    });
};

exports.get = function(id, cb) {
    "use strict";

    var doc = db.collection('ideas').findOne({ _id: id });
    if (doc) {
        cb(null, doc);
    }
    else {
        cb("Document was not found in the database!");
    }
    db.close();
};

exports.update = function(id, property, value, cb) {
    "use strict";

    var updateObj = {};
    updateObj[property] = value;

    db.collections('ideas').updateOne(
        { _id: id },
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
            db.close();
        }
    );
};

exports.delete = function(id, cb) {
    "use strict";

    db.collection('ideas').deleteOne({ _id: id },
    function(err, results) {
        if (err) {
            console.log(chalk.bgRed(err));
            cb(err);
        }
        else {
            console.log(chalk.bgGreen('Document with id %s removed from the database.'), id);
            cb(null, results);
        }
        db.close();
    });
};

function getHeaders(cb) {
    "use strict";

    // Have to figure out how to sort the documents if we need them sorted.
    // Pretty sure find() can do it for us. 
    db.collection('ideas').find().toArray(function(err, docs) {
        if (err) {
            cb(err);
        }
        else if (docs.length === 0) {
            cb(null, docs);
        }
        else {

            var headers = [];
            for (var i = 0; i < docs.length; i++) {
                var descFirstWords = _.take(_.words(docs[i].description), 20);

                headers.push({
                    id: docs[i].ideaId,
                    title: docs[i].title,
                    author: docs[i].author,
                    likes: docs[i].likes.length,
                    abstract: descFirstWords.join(' ')
                });
            }
            cb(null, headers);
        }
        db.close();
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
