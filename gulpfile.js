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

    return exec(command, function(err, stdout, stderr) {
        if (err !== null) {
            console.log(chalk.red(err));
        }
        console.log(stdout);
        console.log(stderr);
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
        chalk.green('start:dev'),
        '\t runs the app server in development mode (doesn\'t use LDAP).',
        '',
        chalk.green('start:prod'),
        '\t runs the app server in production mode (uses LDAP).',
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
        /*
        chalk.green('generate:data'),
        '\tgenerate sample data in the database.',
        '',
        */
        chalk.green('clean:modules'),
        '\tdeletes the npm_modules and the src/lib directories.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
        ' will be required before running the app.',
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

gulp.task('start:dev', ['test:client', 'inject', 'generate:data'], function() {
    "use strict";

    nodemon({
        script: 'server/server.js',
        env: { 'NODE_ENV': 'development' },
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
        .pipe(inject(gulp.src(paths.js, {read: false}), {relative: true}))
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

gulp.task('clean:db-dev', function() {
    "use strict";
    var command = "mongo flintandsteel-dev --eval \"db.dropDatabase()\"";
    runCommand(command);
});


gulp.task('generate:data', ['clean:db-dev'], function() {
    "use strict";
    var command = "node generateData.js";
    runCommand(command);
});
