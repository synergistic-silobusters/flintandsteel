var datastore = require('docstore');

var ideasDb;

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

exports.create = function(id, title, description, author, likes, comments, backs, cb) {
  var idea = new Idea(id, title, description, author, likes, comments, backs);
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

exports.fetch = getHeaders;

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
				headers.push({
					id: docs[i].ideaId,
					title: docs[i].title,
					author: docs[i].author,
					likes: docs[i].likes + docs[i].managerLikes
				});
			}
      cb(null, headers);
		}
	});
}

exports.getInstance = function() {
  return new Ideas();
}

function Idea(id, title, description, author, likes, comments, backs) {
  this.key= id,
	this._id= 'idea_' + id,
	this.ideaId= id,
	this.title= title,
	this.description= description,
	this.author= author,
	this.likes= likes,
	this.comments= comments,
	this.backs= backs

  return this;
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
  console.log("Emitting Event!");
  this.emit("newHeaders", headers);
}
