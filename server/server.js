var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	colors = require('colors');

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

app.listen(process.argv[2] || 8080);