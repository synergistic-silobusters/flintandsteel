var Idea = require('./idea');
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
	ideasDb.get('idea_' + req.body.id, function(err, doc) {
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
