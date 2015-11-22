/* global __dirname */
/* global process */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    os = require('os'),
    del = require('del'),
    chalk = require('chalk'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('jshint-stylish-ex'),
    nodemon = require('gulp-nodemon'),
    karma = require('karma').server,
    spawn = require('child_process').spawn,
    mkdirs = require('mkdirs'),
    angularFilesort = require('gulp-angular-filesort'),
    naturalSort = require('gulp-natural-sort');

var paths = {
    js: [
        'src/**/*.js',
        '!src/dist/**/*.js',
        '!src/lib/**/*.js',
        '!src/**/*.spec.js',
        '!src/**/*.mock.js',
        '!src/**/*.conf.js',
        '!src/**/*.e2e.js'
    ]
};

var commandBuilder = function(command) {
    var cmd = {};
    var cmdArr = command.split(' ');
    cmd.exec = cmdArr.shift();
    cmd.args = cmdArr;
    return cmd;
};

var runCommand = function(command) {
    "use strict";

    if (typeof command.exec === 'undefined') {
        command = commandBuilder(command);
    }

    console.log(command);

    var child = spawn(command.exec, command.args);
    child.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
        process.stdout.write(chalk.red(data));
    });

    return child;
};

gulp.task('default', ['usage']);

gulp.task('usage', function() {
    "use strict";

    var usageLines = [
        '',
        '',
        chalk.green('usage'),
        '\tdisplay this help page.',
        '',
        chalk.green('mongo:start'),
        '\truns the mongodb server - this is required for the app to work.',
        '',
        chalk.green('mongo:stop'),
        '\tstops the mongodb server.',
        '',
        chalk.green('start:dev'),
        '\t runs the app server in development mode (doesn\'t use LDAP, generates data).',
        '',
        chalk.green('start:test'),
        '\t runs the app server in test mode for load testing (doesn\'t generate data).',
        '',
        chalk.green('start:prod'),
        '\t runs the app server in production mode (uses LDAP, HTTPS).',
        '',
        chalk.green('test:client'),
        '\truns the client side tests using karma.',
        '',
        chalk.green('jshint'),
        '\trun jshint on all .spec.js and .js files under src and server.',
        '',
        chalk.green('jscs'),
        '\trun jscs on all .spec.js and .js files under src and server.',
        '',
        chalk.green('code-check'),
        '\tshortcut to run both jshint and jscs on the code.',
        '',
        chalk.green('generate:data'),
        '\tgenerate sample data in the database.',
        '',
        chalk.green('clean:modules'),
        '\tdeletes the npm_modules and the src/lib directories.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
        ' will be required before running the app.',
        '',
        chalk.green('clean:db-dev'),
        '\tclears the development database.',
        ''
    ];
    gutil.log(usageLines.join(os.EOL));
});

gulp.task('mongo:start', function() {
    "use strict";

    var command = 'mongod --config ./server/mongod.conf';
    var mongodProc;
    mkdirs('server/datastore/db');
    mkdirs('server/datastore/log');
    mongodProc = runCommand(command);
    gutil.log('Mongodb server is now ' + chalk.green('running') + '.');

    mongodProc.on('exit', function(code) {
        gutil.log(chalk.yellow('Mongodb server exited with exit code ' + code + '.'));
    });
});

gulp.task('mongo:stop', function(cb) {
    "use strict";

    var command = 'mongo admin --eval db.shutdownServer();';
    var cmdExec = runCommand(command);
    cmdExec.on('exit', function(exitCode) {
        console.log(chalk.yellow("Drop database exited with " + exitCode));
        del('server/datastore/mongod-pids');
        cb(exitCode);
    });
});

gulp.task('start:dev', ['test:client', 'inject', 'generate:data'], function() {
    "use strict";

    nodemon({
        script: 'server/server.js',
        env: { 'NODE_ENV': 'development' },
        'ignore': ['server/datastore/*']
    });
});

gulp.task('start:test', ['test:client', 'inject'], function() {
    "use strict";

    nodemon({
        script: 'server/server.js',
        env: { 'NODE_ENV': 'test' },
        'ignore': ['server/datastore/*']
    });
});

gulp.task('start:prod', ['test:client', 'inject'], function() {
    "use strict";

    nodemon({
        script: 'server/server.js',
        env: { 'NODE_ENV': 'production' },
        'ignore': ['server/datastore/*']
    });
});

gulp.task('inject', function() {
    "use strict";

    gulp.src('./src/index.html')
        .pipe(
            inject(gulp.src(paths.js).pipe(naturalSort()).pipe(angularFilesort()), {relative: true}))
        .pipe(gulp.dest('./src'));
});

gulp.task('jshint', function() {
    "use strict";

    return gulp.src([
        'src/**/*.js',
        'server/**/*.js',
        'gulpfile.js',
        '!src/lib/**/*.*',
        '!server/secrets/*.*'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
    "use strict";

    return gulp.src([
        'src/**/*.js',
        'server/**/*.js',
        'gulpfile.js',
        '!src/lib/**/*.*',
        '!server/secrets/*.*'
    ])
    .pipe(jscs({ configPath: './.jscsrc' }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('code-check', ['jshint', 'jscs']);

gulp.task('test:client', function(done) {
    "use strict";

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test:load', ['initialize:db-dev'], function(cb) {
    "use strict";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var benchrest = require('bench-rest');

    var flow = {
        main: [
            {get: 'http://127.0.0.1:7357/ideaHeaders'}
        ]
    };

    var runOptions = {
       limit: 100,     // concurrent connections
       iterations: 1000  // number of iterations to perform
     };

    benchrest(flow, runOptions)
        .on('error', function error(err, ctxName) {
            if (err.code === 'ECONNREFUSED') {
                console.error(chalk.red('Please ensure the server is started on port 7357 by running gulp start:test'));
                process.exit(1);
                return;
            }
            console.error(chalk.red('Failed in ' + ctxName + ' with error: '), err);
        })
        .on('end', function end(stats, errorCount) {
            console.log(chalk.red('error count: '), errorCount);
            console.log(chalk.green('stats: '), stats);
            cb();
        });
});

gulp.task('clean:modules', function() {
    "use strict";

    return del([
        'node_modules',
        'src/lib'
    ]);
});

gulp.task('clean:db-dev', function() {
gulp.task('clean:db-dev', function(cb) {
    "use strict";
    var command = "mongo flintandsteel-dev --eval db.dropDatabase()";
    var cmdExec = runCommand(command);
    cmdExec.on('exit', function(exitCode) {
        console.log(chalk.yellow("Drop database exited with " + exitCode));
        cb(exitCode);
    });
});

gulp.task('initialize:db-dev', ['clean:db-dev'], function(cb) {
    "use strict";
    var db = require('./server/db.js')('flintandsteel-dev', cb);
});

gulp.task('generate:data', ['initialize:db-dev'], function(cb) {
    "use strict";
    var command = "node generateData.js";
    var cmdExec = runCommand(command);
    cmdExec.on('exit', function(exitCode) {
        console.log(chalk.yellow("Generate data exited with " + exitCode));
        cb(exitCode);
    });
});

// A shorter call for generating colon data
gulp.task('poop', ['generate:data']);
