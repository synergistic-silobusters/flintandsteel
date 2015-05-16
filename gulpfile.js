var gulp = require('gulp'),
	gutil = require('gulp-util'),
	os = require('os'),
	del = require('del'),
	colors = require('colors'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish-ex'),
	nodemon = require('gulp-nodemon');

gulp.task('default', ['usage']);

gulp.task('usage', function() {
	var usageLines = [
		'',
		'',
		colors.green('usage'),
		'\tDisplay this help page.',
		'',
		colors.green('start'),
		'\t runs the app server using express.',
		'',
		colors.green('jshint'),
		'\tRun jshint on the spec and the js folder under src.',
		'',
		colors.green('clean:modules'),
		'\tDeletes the npm_modules and the src/lib directories.',
		'\t' + colors.magenta('NOTE:') + ' ' + colors.green('npm install') + 
		' will be required before running the app.',
		'',
		colors.green('clean:db'),
		'\tResets the persistent app storage by clearing out the datastore folder.',
		''
	];
	gutil.log(usageLines.join(os.EOL));
});

gulp.task('start', ['_cleanUp'], function() {
	nodemon({ 
		script: 'server/server.js',
		'ignore': ['spec/*'] 
	});
});

gulp.task('jshint', function() {
	return gulp.src([
		'src/!lib/*.js',
		'gulpfile.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
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
		'server/datastore/users/*',
		'server/datastore/ideas/*'
	]);
});