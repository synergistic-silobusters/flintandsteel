/* global module */
/* global process */

module.exports = function(dbName, cb) {
    "use strict";

    var module = {};

    var mongodb = require('mongodb'),
        ObjectId = mongodb.ObjectID,
        MongoClient = mongodb.MongoClient,
        chalk = require('chalk'),
        _ = require('lodash'),
        Promise = require('bluebird');

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

    module.findOneById = function findOneById(collection, id) {
        var objId = new ObjectId(id);
        return new Promise(function(resolve, reject) {
            db.collection(collection).findOne({_id: objId}, function(err, doc) {
                if (err) {
                    reject(err);
                }
                else if (doc) {
                    resolve(doc);
                }
                else {
                    var errNotFound = 'NOT_FOUND';
                    reject(new Error(errNotFound));
                }
            });
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
                else if (results.nMatched === 0) {
                    console.error(chalk.yellow('No documents with id ' + id + ' were found.'));
                    cb(null, results);
                }
                else {
                    // console.log(chalk.bgGreen('Document with id %s updated in the ' + collection + ' colletion.'), id);
                    cb(null, results);
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
                else if (results.nMatched === 0) {
                    console.error(chalk.yellow('No documents matching the following query were found:'));
                    console.log(find);
                    cb(null, results);
                }
                else {
                    // console.log(chalk.bgGreen('Document with ' + property + ' %s updated in the database.'), obj.email);
                    cb(null, results);
                }
            }
        );
    };

    module.deleteOne = function deleteOne(collection, id) {
        var objId = new ObjectId(id);

        return new Promise(function(resolve, reject) {
            db.collection(collection).deleteOne({ _id: objId },function(err, results) {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
        });
    };

    module.patchObject = function patchObject(collection, id, command) {
        return new Promise(function(resolve, reject) {
            var updateConfig = {},
                valueObj = {},
                toChange = {},
                idToChange = '',
                path = '',
                runUpdate = true;


            if (/append|create|modify/.test(command.operation)) {
                valueObj = JSON.parse(command.value);

                if (collection === 'ideas') {
                    if (command.path === 'backs' || command.path === 'updates' && valueObj.authorId) {
                        valueObj.authorId = new ObjectId(valueObj.authorId);
                    }
                    else if (command.path === 'team' && valueObj.memberId) {
                        valueObj.memberId = new ObjectId(valueObj.memberId);
                    }
                    else if (command.path === 'likes' && valueObj.userId) {
                        valueObj.userId = new ObjectId(valueObj.userId);
                    }
                    else if (command.path === 'comments' && valueObj.commentId) {
                        valueObj.commentId = new ObjectId(valueObj.commentId);
                    }
                    else if (command.path === 'eventId') {
                        // We could have no event tagged for the idea
                        if (valueObj !== '') {
                            valueObj = new ObjectId(valueObj);
                        }
                    }
                }
                else if (collection === 'comments' && command.path === 'authorId' || command.path === 'parentId') {
                    valueObj = new ObjectId(valueObj);
                }
            }
            
            switch (command.operation) {
                case "append":
                    toChange = {};
                    valueObj._id = new ObjectId();
                    toChange[command.path] = valueObj;
                    updateConfig = {
                        $push: toChange
                    };
                    if (collection === 'ideas') {
                        updateConfig.$set = { "timeModified": new Date().toISOString() };
                    }
                    break;
                case "create":
                    toChange = {};
                    toChange[command.path] = valueObj;
                    if (collection === 'ideas') {
                        toChange.timeModified = new Date().toISOString();
                    }
                    updateConfig = { $set: toChange };
                    break;
                case "delete":
                    toChange = {};
                    if (/backs|team|updates|likes|comments/.test(command.path)) {
                        path = command.path.split('/')[0];
                        idToChange = command.path.split('/')[1];

                        if (/comments/.test(command.path)) {
                            toChange[path] = { commentId: new ObjectId(idToChange) };
                        }
                        else {
                            toChange[path] = { _id: new ObjectId(idToChange) };
                        }
                        updateConfig = { $pull: toChange };
                        if (collection === 'ideas') {
                            updateConfig.$set = { "timeModified": new Date().toISOString() };
                        }
                    }
                    else {
                        toChange[command.path] = '';
                        updateConfig = { $unset: toChange };
                        if (collection === 'ideas') {
                            updateConfig.$set = { "timeModified": new Date().toISOString() };
                        }
                    }
                    break;
                case "modify":
                    toChange = {};
                    if (/backs|updates|likes/.test(command.path)) {
                        var toFind = {}, projection = {};

                        path = command.path.split('/')[0];
                        idToChange = command.path.split('/')[1];

                        toFind[path + '._id'] = new ObjectId(idToChange);
                        projection[path] = 1;
                        runUpdate = false;

                        for (var prop in valueObj) {
                            if (valueObj.hasOwnProperty(prop)) {
                                toChange[path + '.$.' + prop] = valueObj[prop];
                            }
                        }
                        if (collection === 'ideas') {
                            toChange.timeModified = new Date().toISOString();
                        }

                        db.collection(collection).update(toFind, { $set: toChange }, function(err, result) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(result);
                            }
                        });
                    }
                    else {
                        toChange[command.path] = valueObj;
                        if (collection === 'ideas') {
                            toChange.timeModified = new Date().toISOString();
                        }
                        updateConfig = { $set: toChange };
                    }
                    break;
                default:
                    resolve('operation ' + command.operation + ' not understood by the server :/');
                    runUpdate = false;
                    break;
            }
            if (runUpdate) {
                db.collection(collection).update(
                    { _id: new ObjectId(id) },
                    updateConfig,
                    function(err, results) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(results);
                        }
                    }
                );
            }
        });
    };

    return module;
};
