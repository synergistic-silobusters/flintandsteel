var gulp = require('gulp'),
	gutil = require('gulp-util'),
	inject = require('gulp-inject'),
	os = require('os'),
	del = require('del'),
	chalk = require('chalk'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish-ex'),
	nodemon = require('gulp-nodemon'),
	karma = require('karma').server,
	fs = require('fs'),
	ideas = require('./ideas').ideas;

var paths = {
		js: ['src/**/*.js',
	  '!src/dist/**/*.js',
		'!src/lib/**/*.js',
	  '!src/**/*.spec.js',
		'!src/**/*.mock.js',
	  '!src/**/*.conf.js',
	  '!src/**/*.e2e.js']
};

gulp.task('default', ['usage']);

gulp.task('usage', function() {
	var usageLines = [
		'',
		'',
		chalk.green('usage'),
		'\tDisplay this help page.',
		'',
		chalk.green('start'),
		'\t runs the app server using express.',
		'',
		chalk.green('test:client'),
		'\t runs the client side tests using karma.',
		'',
		chalk.green('jshint'),
		'\tRun jshint on the spec and the js folder under src.',
		'',
		chalk.green('generate:data'),
		'\tGenerate sample data in the database.',
		'',
		chalk.green('clean:modules'),
		'\tDeletes the npm_modules and the src/lib directories.',
		'\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
		' will be required before running the app.',
		'',
		chalk.green('clean:db'),
		'\tResets the persistent app storage by clearing out the datastore folder.',
		''
	];
	gutil.log(usageLines.join(os.EOL));
});

gulp.task('start', ['_cleanUp', 'test:client', 'inject'], function() {
	nodemon({
		script: 'server/server.js',
		'ignore': ['spec/*']
	});
});

gulp.task('inject', function() {
	gulp.src('./src/index.html')
		.pipe(inject(gulp.src(paths.js, {read: false}), {relative: true}))
		.pipe(gulp.dest('./src'));
})

gulp.task('jshint', function() {
	return gulp.src([
		'src/!lib/*.js',
		'gulpfile.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

gulp.task('test:client', function(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);
});

gulp.task('clean:modules', function() {
	return del([
		'node_modules',
		'src/lib'
	]);
});

gulp.task('clean:db', function() {
	return del([
		'server/datastore/users/*',
		'server/datastore/ideas/*'
	]);
});

gulp.task('_createDataDirs', function() {
	return gulp.src('README.md')
	.pipe(gulp.dest('server/datastore/ideas'))
	.pipe(gulp.dest('server/datastore/users'));
});

gulp.task('_cleanUp', ['_createDataDirs'], function() {
	return del([
		'server/datastore/users/README.md',
		'server/datastore/ideas/README.md'
	]);
});

gulp.task('generate:data', ['_createDataDirs', '_cleanUp'], function() {
	filePattern = "server/datastore/ideas/idea_X.json";
	fileName    = filePattern.replace("X", "0");

	fs.stat(fileName, function(err, stat) {
	  var id = 0;

	  if (err === null) {
	    // File exists
	    gutil.log(chalk.red("ERROR: Please delete the ideas in 'server/datastore/ideas' to continue"));
	  } else if (err.code == 'ENOENT') {
	    // File does not exist, generate ideas
	    ideas.forEach(function(idea, index, arr) {
	      fs.writeFile(filePattern.replace("X", index), JSON.stringify(idea), function(err) {
	        if (err) {
				// Should no longer happen due to the gulp pre-requisite tasks.
				gutil.log(chalk.red("ERROR: Try to create the 'server/datastore/ideas' directory path to continue."));
			}
	      });
	    });

	  } else {
	    // Something went very wrong.
	    console.error("ERROR: ", err.code);
	    throw err;
	  }
	});
});
