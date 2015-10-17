/* global __dirname */

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
    fs = require('fs'),
    ideas = require('./ideas').ideas,
    exec = require('child_process').exec,
    mkdirs = require('mkdirs');

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

var runCommand = function(command) {
    "use strict";

    return exec(command, function(err) {
        if (err !== null) {
            console.log(chalk.red(err));
        }
    });
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
        chalk.green('start'),
        '\truns the app server using express.',
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
        chalk.green('generate:data'),
        '\tgenerate sample data in the database.',
        '',
        chalk.green('clean:modules'),
        '\tdeletes the npm_modules and the src/lib directories.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
        ' will be required before running the app.',
        '',
        chalk.green('clean:db'),
        '\tresets the persistent app storage by clearing out the datastore folder.',
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
        gutil.log('Mongodb server exited with exit code ' + code + '.');
    });
});

gulp.task('mongo:stop', function() {
    "use strict";

    var command = 'mongo admin --eval "db.shutdownServer();"';
    runCommand(command);

    del('server/datastore/mongod-pids');
});

gulp.task('start', ['_cleanUp', 'test:client', 'inject', 'mongo:start'], function() {
    "use strict";

    nodemon({
        script: 'server/server.js',
        'ignore': ['spec/*']
    });
});

gulp.task('inject', function() {
    "use strict";

    gulp.src('./src/index.html')
        .pipe(inject(gulp.src(paths.js, {read: false}), {relative: true}))
        .pipe(gulp.dest('./src'));
});

gulp.task('jshint', function() {
    "use strict";

    return gulp.src([
        'src/**/*.js',
        'server/**/*.js',
        'gulpfile.js',
        '!src/lib/**/*.*'
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
        '!src/lib/**/*.*'
    ])
    .pipe(jscs({ configPath: './.jscsrc' }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('test:client', function(done) {
    "use strict";

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('clean:modules', function() {
    "use strict";

    return del([
        'node_modules',
        'src/lib'
    ]);
});

gulp.task('clean:db', function() {
    "use strict";

    return del([
        'server/datastore/users/*',
        'server/datastore/ideas/*'
    ]);
});

gulp.task('_cleanUp', function() {
    "use strict";

    mkdirs('server/datastore/users');
    mkdirs('server/datastore/ideas');
});

gulp.task('generate:data', ['_createDataDirs', '_cleanUp'], function() {
    "use strict";

    var filePattern = "server/datastore/ideas/idea_X.json";
    var fileName = filePattern.replace("X", "0");

    fs.stat(fileName, function(err /*, stat */) {

        if (err === null) {
            // File exists
            gutil.log(chalk.red("ERROR: Please delete the ideas in 'server/datastore/ideas' to continue"));
        } 
        else if (err.code === 'ENOENT') {
            // File does not exist, generate ideas
            ideas.forEach(function(idea, index /*, arr */) {
                fs.writeFile(filePattern.replace("X", index), JSON.stringify(idea), function(err) {
                    if (err) {
                        // Should no longer happen due to the gulp pre-requisite tasks.
                        gutil.log(chalk.red("ERROR: Try to create the 'server/datastore/ideas' directory path to continue."));
                    }
                });
            });
        }
        else {
            // Something went very wrong.
            console.error("ERROR: ", err.code);
            throw err;
        }
    });
});
