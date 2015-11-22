/* global __dirname */
/* global process */
/* global GLOBAL */

// set name of db =====================================================
var dbName = 'flintandsteel';

if (process.env.NODE_ENV !== 'production') {
    dbName += "-dev";
}

// modules ============================================================
var express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    chalk = require('chalk'),
    bodyParser = require('body-parser'),
    external = require('external-ip')(),
    fs = require('fs'),
    passport = require('passport'),
    WindowsStrategy = require('passport-windowsauth'),
    ip = require('ip');
// var cluster          = require('cluster');
// var numCpus          = require('os').cpus().length;

// initialize db ======================================================
GLOBAL.db = require('./db')(dbName);

// configuration ======================================================
var port = process.env.PORT_HTTP || process.argv[2] || 8080;

if (process.env.NODE_ENV === 'test') {
    port = 7357;
}

var app = express();

app.use(express.static(path.join(__dirname + '/../src')));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {

    app.use(morgan(':remote-addr - ' +
        chalk.cyan('[:date] ') +
        chalk.green('":method :url ') +
        chalk.gray('HTTP/:http-version" ') +
        chalk.yellow(':status ') +
        ':res[content-length] ' +
        chalk.gray('":referrer" ":user-agent" ') +
        'time=:response-time ms'
    ));

    app.use(passport.initialize());

    passport.use(new WindowsStrategy(require('./secrets/ldapAuth').config,
        function(profile, done) {
            "use strict";
            if (profile) {
                done(null, profile);
            }
            else {
                done(null, false, "Invalid Credentials");
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        "use strict";
        console.log('serializeUser: ' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        "use strict";
        if (id) {
            done(null);
        }
        //TODO: Not sure what this is or why we need it, but we'll do it later.
        // db.users.findById(id, function(err, user){
        //     console.log(user);
        //     if (!err) {
        //         done(null, user);
        //     }
        //     else {
        //         done(err, null);
        //     }
        // });
    });
}

// routes =============================================================
require('./routes')(app); //configure our routes

// show IP settings ===================================================
external(function(err, ipExternal) {
    "use strict";
    // if (cluster.isMaster) {
    if (err) {
        console.log(
            chalk.red('Could not determine network status, server running in local-only mode') +
            '\nServer listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:' + port)
        );
    }
    else {
        console.log(
            'Server listening at' +
            '\n\tlocal:    ' + chalk.magenta('http://localhost:' + port) +
            '\n\tnetwork:  ' + chalk.magenta('http://' + ip.address() + ':' + port) +
            '\n\tExternal: ' + chalk.magenta('http://' + ipExternal + ':' + port) +
            '\n\tExternal access requires port ' + port + ' to be configured properly.'
        );
    }
    // }
});

// start app ==========================================================
if (process.env.NODE_ENV !== 'production') {
    // if (cluster.isMaster) {
    console.log('Server running in ' + chalk.cyan(process.env.NODE_ENV) + ' mode.');

    // console.log('Master cluster setting up ' + numCpus + ' workers to listen on port ' + port + '...');
    // var workers = [];
    // for (var i = 0; i < numCpus; i++) {
    //     workers.push(cluster.fork());
    // }

    // cluster.on('online', function(worker) {
    //     console.log('Worker ' + worker.process.pid + ' is online!');
    // });
    //
    // cluster.on('exit', function(worker, code, signal) {
    //     console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    //     console.log('Starting a new worker');
    //     for (var i = workers.length - 1; i >= 0; i--) {
    //       if (worker === workers[i]) {
    //         workers.splice(i, 1);
    //         break;
    //       }
    //     }
    //     workers.push(cluster.fork());
    // });
    // } else {
    app.listen(port);
    // process.on('message', function(message) {
    //     if(message.type === 'shutdown') {
    //         process.exit(0);
    //     }
    // });
    // }
}
else {
    console.log('Server running in ' + chalk.cyan('production') + ' mode.');
    var https = require('https');
    var http = require('http');
    var options = {
        key: fs.readFileSync('./server/secrets/innovate.ra.rockwell.com.key'),
        cert: fs.readFileSync('./server/secrets/innovate.ra.rockwell.com.crt')
    };

    https.createServer(options, app).listen(443);

    http.createServer(function(req, res) {
        "use strict";

        res.writeHead(302, { "Location": "https://" + req.headers.host + req.url });
        res.end();
    }).listen(80);
}
