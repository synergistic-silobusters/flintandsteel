// Karma configuration
// Generated on Mon May 25 2015 16:54:36 GMT+0530 (IST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [

            'src/lib/angular/angular.js',
            'src/lib/angular-timeline/dist/angular-timeline.js',
            'src/lib/angular-mocks/angular-mocks.js',
            'src/lib/angular-ui-router/release/angular-ui-router.js',
            'src/lib/angular-animate/angular-animate.js',
            'src/lib/angular-aria/angular-aria.js',
            'src/lib/angular-material/angular-material.js',
            'src/lib/angular-material/angular-material-mocks.js',
            'src/lib/angular-messages/angular-messages.js',
            'src/lib/angular-identicon/src/identiconDirective.js',
            'src/lib/angular-identicon/src/md5.js',
            'src/lib/identicon/identicon.js',
            'src/lib/identicon/pnglib.js',
            'src/lib/moment/moment.js',
            'src/lib/lodash/lodash.js',
            'src/app.js',
            'src/about/about.js',
            'src/events/eventSvc/eventSvc.mock.js',
            'src/ideas/ideaSvc/ideaSvc.mock.js',
            'src/users/userSvc/userSvc.mock.js',
            'src/toastSvc/toastSvc.js',
            'src/homeView/homeView.js',
            'src/events/**/*.js',
            'src/ideas/**/*.js',
            'src/navigation/**/*.js',
            'src/users/**/*.js',
            'src/utilities/**/*.js',
            'src/**/*.spec.js',
            'src/**/*.tpl.html'
        ],


        // list of files to exclude
        exclude: [
            'src/assets/**/*'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/app.js': ['coverage'],
            'src/about/about.js': ['coverage'],
            'src/toastSvc/toastSvc.js': ['coverage'],
            'src/homeView/homeView.js': ['coverage'],
            'src/ideas/**/!(*spec|*mock).js': ['coverage'],
            'src/navigation/**/!(*spec|*mock).js': ['coverage'],
            'src/users/**/!(*spec|*mock).js': ['coverage'],
            'src/utilities/**/!(*spec|*mock).js': ['coverage'],
            'src/**/*.tpl.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
