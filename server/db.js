/* global module */
/* global process */

module.exports = function(dbName, cb) {
    "use strict";

    var module = {};

    var mongodb = require('mongodb'),
        ObjectId = mongodb.ObjectID,
        MongoClient = mongodb.MongoClient,
        chalk = require('chalk'),
        _ = require('lodash');

    var db;

    module.createCollections = function createCollection(names, db) {
        var collectionPromises = [];
        if (!_.isArray(names)) {
            names = [names];
        }
        _.forEach(names, function(name) {
            if (_.isString(name) && !_.isUndefined(db)) {
                collectionPromises.push(new Promise(function(resolve, reject) {
                    db.createCollection(name, function(error, collection) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(collection);
                        }
                    });
                }));
            }
        });
        return Promise.all(collectionPromises);
    };

    if (_.isString(dbName)) {
        MongoClient.connect("mongodb://localhost:27017/" + dbName, function(err, database) {
            console.log(chalk.yellow("Setting up db " + dbName));
            db = database;
            if (db === null) {
                console.error(chalk.red("Please ensure you've started the mongodb server using gulp mongo:start."));
                process.exit(1);
                return;
            }
            module.createCollections(['users', 'ideas', 'comments', 'events'], database).then(function() {
                console.log(chalk.green("Database collections created!"));
                if (typeof cb !== 'undefined') {
                    cb(null);
                }
            }).catch(function(error) {
                console.log(chalk.red(error));
            });
        });
    }

    module.getDb = function getDb() {
        return db;
    };

    module.insertOne = function insertOne(collection, obj, cb) {
        db.collection(collection).insertOne(obj, function(err, doc) {
            if (err) {
                console.error(chalk.bgRed(err));
                cb(err);
            }
            else {
                // console.log(chalk.bgGreen('Document with id %s stored in the ' + collection + ' collection.'), doc.insertedId);
                cb(null, doc);
            }
        });
    };

    module.find = function find(collection, projection, cb) {
        // TODO: In between find() and toArray() we can put sort() with the fields
        // we want to sort by, eg. {title: 1}.
        db.collection(collection).find({}, projection).toArray(function(err, docs) {
            if (err) {
                console.error(chalk.bgRed(err));
                cb(err);
            }
            else {
                // console.log(chalk.bgGreen('All documents in the ' + collection + ' collection found.'));
                cb(null, docs);
            }
        });
    };

    module.findOneById = function findOneById(collection, id, cb) {
        var objId = new ObjectId(id);

        db.collection(collection).findOne({_id: objId}, function(err, doc) {
            if (err) {
                console.error(chalk.bgRed(err));
                cb(err);
            }
            else if (doc) {
                // console.log(chalk.bgGreen('Document with id %s found in the ' + collection + ' collection.'), id);
                cb(null, doc);
            }
            else {
                var errNotFound = "Document " + id + " was not found in " + collection + " collection!";
                console.error(chalk.bgRed(errNotFound));
                cb(errNotFound);
            }
        });
    };

    module.findOneByProperty = function findOneByProperty(collection, property, value, cb) {
        var query = {};
        query[property] = value;
        db.collection(collection).findOne(query, function(err, doc) {
            if (err) {
                console.error(chalk.bgRed(err));
                cb(err);
            }
            else if (doc) {
                cb(null, doc);
            }
            else {
                var errNotFound = "Document matching " + property + ": " + value + " was not found in " + collection + " collection!";
                console.error(chalk.bgRed(errNotFound));
                cb(errNotFound);
            }
        });
    };

    module.updateOne = function updateOne(collection, id, obj, cb) {

        var objId = new ObjectId(id);

        db.collection(collection).updateOne(
            { _id: objId },
            { $set: obj },
            function(err, results) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    // console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' colletion.'), id);
                    cb(null, results);
                }
            }
        );
    };

    module.updateOnePushArray = function updateOnePushArray(collection, id, property, value, cb) {

        var objId = new ObjectId(id);

        var update = {};
        update[property] = value;

        var push = {};
        push.$push = update;

        db.collection(collection).updateOne(
            { _id: objId },
            push,
            { upsert: true },
            function(err, results) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    // console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' collection.'), id);
                    cb(null, results);
                }
            }
        );
    };

    module.updateOneArrayElement = function updateArrayElement(collection, id, property, searchProperty, searchValue, newValue, cb) {
        var objId = new ObjectId(id);

        var query = {};
        query._id = objId;
        query[property + "." + searchProperty] = searchValue; // Find the old value

        var update = {};
        update.$set = {};
        // '.$' Update first match of query (should be only match)
        update.$set[property + ".$"] = newValue;

        db.collection(collection).updateOne(
            query,
            update,
            function(err, results) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    // console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' collection.'), id);
                    cb(null, results);
                }
            }
        );
    };

    module.updateOnePullArray = function updateOnePushArray(collection, id, property, value, cb) {

        var objId = new ObjectId(id);

        var update = {};
        update[property] = value;

        var pull = {};
        pull.$pull = update;

        db.collection(collection).updateOne(
            { _id: objId },
            pull,
            function(err, results) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    // console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' collection.'), id);
                    cb(null, results);
                }
            }
        );
    };

    module.findAndPullArray = function findAndPullArray(collection, property, value, cb) {
        var find = {};
        find[property] = value;

        var pull = {};
        pull.$pull = find;

        db.collection(collection).findAndModify(
          find,
          [],
          pull,
          function(err, results) {
              if (err) {
                  console.error(chalk.bgRed(err));
                  cb(err);
              }
              else {
                  //   console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' collection.'), results.value._id);
                  cb(null, results.value._id);
              }
          }
        );
    };

    module.findByPropertyAndSet = function findByPropertyAndSet(collection, obj, property, cb) {
        var find = {};
        find[property] = obj[property];

        var set = {};
        set.$set = obj;

        db.collection(collection).findAndModify(
            find,
            [],
            set,
            { upsert: true },
            function(err, results) {
                if (err) {
                    console.error(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    // console.log(chalk.bgGreen('Document with ' + property + ' %s updated in the database.'), obj.email);
                    cb(null, results);
                }
            }
        );
    };

    module.deleteOne = function deleteOne(collection, id, cb) {
        var objId = new ObjectId(id);

        db.collection(collection).deleteOne({ _id: objId },function(err, results) {
            if (err) {
                console.error(chalk.bgRed(err));
                cb(err);
            }
            else {
                // console.log(chalk.bgGreen('Document with id %s removed from the ' + collection + ' collection.'), id);
                cb(null, results);
            }
        });
    };

    return module;
};
