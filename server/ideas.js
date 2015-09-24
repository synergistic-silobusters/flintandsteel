var Idea = require('./idea');
var chalk = require('chalk');
var datastore = require('docstore');
var _ = require('lodash');

var ideasDb, userDb;

var IdeasSingleton;

// Datastore filter to find everything
var filter = function dbFilter(doc) {
    return true;
};

datastore.open('./server/datastore/ideas', function(err, store) {
    if (err) {
        console.log(err);
    }
    else {
        ideasDb = store;
    }
});

datastore.open('./server/datastore/users', function(err, store) {
    if (err) {
        console.log(err);
    }
    else {
        userDb = store;
    }
});

exports.create = function(id, title, description, author, likes, comments, backs, cb) {
  var idea = Idea.create(id, title, description, author, likes, comments, backs);
  ideasDb.save(
    idea
        ,
    function(err, doc) {
      if (err) {
        cb(err);
      }
      cb(null, doc);
  });
};

exports.get = function(id, cb) {
    ideasDb.get('idea_' + id, function(err, doc) {
        if (err) {
            cb(err);
        }
        else {
            var idea = doc;
            idea.id = doc.ideaId;
            idea.ideaId = undefined;
            cb(null, idea);
        }
    });
};

exports.update = function(id, property, value, cb) {
    ideasDb.get('idea_' + id, function(err, doc) {
        if (err) {
            cb(err);
        }
        else {
            doc[property] = value;
            ideasDb.save(doc, function(err, doc) {
                if (err) {
                    console.log(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    console.log(chalk.bgGreen('Document with key %s updated in ideas.'), doc.key);
                    cb(null);
                }
            });
        }
    });
}

exports.fetch = getHeaders;

exports.delete = function(id, cb) {
    ideasDb.get('idea_' + id, function(err, doc) {
        if (err) {
            cb(err);
        }
        else {
            doc.likes.map(function(user) {
                userDb.scan(function(doc) {
                    return doc.name === user;
                }, function(err,docs) {
                    if (err) {
                        cb(err);
                    }
                    docs.map(function(userDoc) {
                        var ideaIdIndex = userDoc.likedIdeas.indexOf(id);
                        console.log(userDoc.likedIdeas);
                        console.log(id);
                        console.log(ideaIdIndex);
                        if (ideaIdIndex >= 0) {
                            userDoc.likedIdeas.splice(ideaIdIndex, 1);
                            userDb.save(userDoc, function(err) {
                                console.log("ERR: Could not resave updated user during idea delete.")
                            });
                        }
                    });

                });
            });
            ideasDb.remove('idea_' + id, function(err) {
                if (err) {
                    console.log(chalk.bgRed(err));
                    cb(err);
                }
                else {
                    console.log(chalk.bgGreen('Document with key %s removed in ideas.'), ('idea_' + id));
                    cb(null);
                }
            });
        }
    });
}

function getHeaders(cb) {
  ideasDb.scan(filter, function(err, docs) {
        if (err) {
            cb(err);
        }
        else if (docs.length === 0) {
            cb(null, docs);
        }
        else {
            docs.sort(function(a,b) {
                return a.key - b.key;
            });
            var headers = [];
            for(var i = 0; i < docs.length; i++) {
                var descFirstWords = _.take(_.words(docs[i].description), 12);

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
    });
}

exports.getInstance = function() {
    return new Ideas();
}

function Ideas() {
    if (IdeasSingleton) {
        return IdeasSingleton;
    }
    else {
        IdeasSingleton = this;
        return IdeasSingleton;
    }
}

require("util").inherits(Ideas, require("events").EventEmitter);

Ideas.prototype.newHeaders = function(headers) {
    this.emit("newHeaders", headers);
}

Ideas.prototype.updateIdea = function(idea, oldKey) {
    this.emit("updateIdea_" + oldKey || idea.key , idea);
}
