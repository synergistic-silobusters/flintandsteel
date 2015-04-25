var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	colors = require('colors'),
	datastore = require('docstore');

var userDb, ideasDb;

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

app.use(morgan(':remote-addr - ' + 
			   '[:date] '.cyan + 
			   '":method :url '.green + 
			   'HTTP/:http-version" '.gray + 
			   ':status '.yellow + 
			   ':res[content-length] ' + 
			   '":referrer" ":user-agent" '.gray + 
			   'time=:response-time ms'
));
app.use(express.static(path.join(__dirname + '/../src')));

app.post('/login', function(req, res) {
	userDb.get(req.body.username, function(err, doc) {
		if (err) {
			res.sendStatus(400);
		}
		else {
			var accountFromDb = JSON.parse(doc.jsonStr);
			if (req.body.password === accountFromDb.password) {
				res.sendStatus(200);
			}
			else {
				res.sendStatus(401);
			}
		}
	});
	console.log(req.body);
});

app.post('/signup', function(req, res) {
	saveToDatastore(req.body.username, req.body, userDb);
	console.log(req.body);
	res.sendStatus(201);
});

app.listen(process.argv[2] || 8080);


saveToDatastore = function(key, value, datastore, logOnlyErrors) {
	datastore.save(
	{
		key: key,
		_id: key,
		jsonStr: JSON.stringify(value)
	}, 
	function(err, doc) {
		if (err) {
			console.log(err);
		}
		else if (!logOnlyErrors) {
			console.log('Document with key ' + doc.key + ' stored.');
		}
	});
};