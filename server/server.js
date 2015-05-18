var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	chalk = require('chalk'),
	datastore = require('docstore'),
	bodyParser = require('body-parser'),
	external = require('external-ip')(),
	ip = require('ip');

var userDb, ideasDb, ipExternal;

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
					name: doc.name
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
		name: req.body.name
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
	ideasDb.save(
	{
		key: req.body.id,
		_id: req.body.id,
		ideaId: req.body.id,
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
		likes: req.body.likes,
		managerLikes: req.body.managerLikes,
		comments: req.body.comments,
		backs: req.body.backs
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

app.get('/idea', function(req, res) {
	ideasDb.get(req.query.id, function(err, doc) {
		if (err) {
			res.status(200).send('IDEA_NOT_FOUND');
		}
		else {
			var idea = doc;
			idea.id = doc.ideaId;
			idea.ideaId = undefined;
			res.status(200).json(idea);
		}
	});
});
app.get('/ideaheaders', function(req, res) {
	ideasDb.scan(filter, function(err, docs) {
		if (err) {
			res.sendStatus(500);
		}
		else if (docs.length === 0) {
			res.status(200).send('NO_IDEAS_IN_STORAGE');
		}
		else {
			var headers = [];
			for(var i = 0; i < docs.length; i++) {
				headers.push({
					id: docs[i].ideaId,
					title: docs[i].title,
					author: docs[i].author,
					likes: docs[i].likes + docs[i].managerLikes
				});
			}
			res.status(200).json(headers);
		}
	});
});

external(function (err, ipExternal) {
    if (err) {
        throw err;
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