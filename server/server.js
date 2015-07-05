var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	chalk = require('chalk'),
	datastore = require('docstore'),
	bodyParser = require('body-parser'),
	external = require('external-ip')(),
	ip = require('ip'),
	_ = require('lodash'),
	ideas = require('./ideas');

var userDb, ideasDb, ipExternal;

var IdeasInstance = ideas.getInstance();

datastore.open('./server/datastore/users', function(err, store) {
	if (err) {
		console.log(err);
	}
	else {
		userDb = store;
	}
});

datastore.open('./server/datastore/ideas', function(err, store) {
	if (err) {
		console.log(err);
	}
	else {
		ideasDb = store;
	}
});

var app = express();

// Datastore filter to find everything
var filter = function dbFilter(doc) {
	return true;
};

function startSees(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'identity'
  });
  res.write("\n");

  return function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  }
}

app.use(morgan(':remote-addr - ' +
			   chalk.cyan('[:date] ') +
			   chalk.green('":method :url ') +
			   chalk.gray('HTTP/:http-version" ') +
			   chalk.yellow(':status ') +
			   ':res[content-length] ' +
			   chalk.gray('":referrer" ":user-agent" ') +
			   'time=:response-time ms'
));
app.use(express.static(path.join(__dirname + '/../src')));
app.use(bodyParser.json());


app.post('/login', function(req, res) {
	userDb.get(req.body.username, function(err, doc) {
		if (err) {
			res.status(200).json({ status: 'USER_NOT_FOUND' });
		}
		else {
			if (req.body.password === doc.password) {
				res.status(200).json({
					status: 'AUTH_OK',
					id: doc.accountId,
					username: req.body.username,
					email: doc.email,
					name: doc.name,
					likedIdeas: doc.likedIdeas
				});
			}
			else {
				res.status(200).json({
					status: 'AUTH_ERROR',
					id: undefined,
					username: undefined,
					name: undefined
				});
			}
		}
	});
});
app.post('/signup', function(req, res) {
	userDb.save(
	{
		key: req.body.username,
		_id: req.body.username,
		accountId: req.body.id,
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		likedIdeas: req.body.likedIdeas
	},
	function(err, doc) {
		if (err) {
			console.log(chalk.bgRed(err));
		}
		else {
			console.log(chalk.bgGreen('Document with key %s stored in users.'), doc.key);
		}
	});
	res.sendStatus(201);
});
app.post('/idea', function(req, res) {
	ideas.create(
		req.body.id,
		req.body.title,
		req.body.description,
		req.body.author,
		req.body.likes,
		req.body.comments,
		req.body.backs,
		function(err, doc) {
			if (err) {
				console.log(chalk.bgRed(err));
			}
			else {
				console.log(chalk.bgGreen('Document with key %s stored in ideas.'), doc.key);
				ideas.fetch(function(err, headers) {
					IdeasInstance.newHeaders(headers);
				});
			}
		}
	);
	res.sendStatus(201);
});
app.post('/updateidea', function(req, res) {
	ideas.update(req.body.id, req.body.property, req.body.value, function(err){
		if (err) {
			res.sendStatus(500);
		}
		else {
			ideas.get(req.body.id, function(err, idea) {
				IdeasInstance.updateIdea(idea);
			});
			ideas.fetch(function(err, headers) {
				IdeasInstance.newHeaders(headers);
			});
			res.sendStatus(200);
		}
	});
});
app.post('/updateaccount', function(req, res) {
	userDb.get(req.body.username, function(err, doc) {
		if (err) {
			res.sendStatus(500);
		}
		else {
			_.assign(doc, req.body);
			doc.status = undefined;
			doc.id = undefined;
			userDb.save(doc, function(err, doc) {
				if (err) {
					console.log(chalk.bgRed(err));
				}
				else {
					console.log(chalk.bgGreen('Document with key %s updated in account.'), doc.key);
					res.sendStatus(200);
				}
			});
		}
	});
});

app.get('/idea', function(req, res) {
	ideas.get(req.query.id, function(err, idea) {
		if (err) {
			res.status(200).send('IDEA_NOT_FOUND');
		}
		else {
			res.status(200).json(idea);
		}
	});
});
app.get('/idea/:id/events', function (req, res) {
	var sse = startSees(res);
	IdeasInstance.on("updateIdea_" + req.params.id, updateIdea);

	req.on("close", function() {
		IdeasInstance.removeListener("updateIdea_" + req.params.id, updateIdea);
	});

	function updateIdea(idea) {
		sse("updateIdea_" + req.params.id, idea, req.params.id);
	}
});
app.get('/ideaheaders', function(req, res) {
	ideas.fetch(function(err, headers) {
		if (err) {
			res.sendStatus(500);
		}
		else if (headers.length === 0) {
			res.status(200).send('NO_IDEAS_IN_STORAGE');
		}
		else {
			res.status(200).json(headers);
		}
	});
});
app.get('/ideaheaders/events', function (req, res) {
	var sse = startSees(res);
	IdeasInstance.on("newHeaders", updateHeaders);

	req.on("close", function() {
		IdeasInstance.removeListener("newHeaders", updateHeaders);
	});

	function updateHeaders(headers) {
		sse("newHeaders", headers);
	}
});
app.get('/uniqueid', function(req, res) {
	var dbToSearch,
		propName = '';
	if (req.query.for === 'idea') {
		dbToSearch = ideasDb;
		propName = 'ideaId';
	}
	else if (req.query.for === 'user'){
		dbToSearch = userDb;
		propName = 'accountId';
	}
	if (dbToSearch) {
		dbToSearch.scan(filter, function(err, docs) {
			if (err) {
				res.sendStatus(500);
			}
			else {
				var listofIds = [], id = 0;
				var matcher = function matcher(item) {
					return item === id;
				};
				for (var i = 0; i < docs.length; i++) {
					listofIds.push(docs[i][propName]);
				}
				while(_.findIndex(listofIds, matcher) !== -1) {
					id++;
				}
				res.status(200).json(id);
			}
		});
	}
});
app.get('/isuniqueuser', function(req, res) {
	userDb.scan(filter, function(err, docs) {
		if (err) {
			res.sendStatus(500);
		}
		else {
			var userFound = false;
			var matcher = function matcher(item) {
				return item === req.query.user;
			};
			for (var i = 0; i < docs.length; i++) {
				userFound = (docs[i].username === req.query.user);
				if (userFound) {
					break;
				}
			}
			res.status(200).json(!userFound);
		}
	});
});

external(function (err, ipExternal) {
    if (err) {
        console.log(
        	chalk.red('Could not determine network status, server running in local-only mode') +
        	'\nServer listening at' +
    		'\n\tlocal:    ' + chalk.magenta('http://localhost:8080')
        );
    }
    else {
    	console.log(
    		'Server listening at' +
    		'\n\tlocal:    ' + chalk.magenta('http://localhost:8080') +
    		'\n\tnetwork:  ' + chalk.magenta('http://') + chalk.magenta(ip.address()) + chalk.magenta(':8080') +
    		'\n\tExternal: ' + chalk.magenta('http://') + chalk.magenta(ipExternal) + chalk.magenta(':8080') +
    		'\n\tExternal access requires port 8080 to be configured properly.'
    	);
    }
});

app.listen(process.argv[2] || 8080);
