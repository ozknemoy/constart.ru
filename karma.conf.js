// Karma configuration
// Generated on Sun Dec 18 2016 21:19:48 GMT+0400 (Московское время (зима))

module.exports = function (config) {
    config.set({
        plugins: [
            'karma-chrome-launcher',
            // for $templateCache
            'karma-ng-html2js-preprocessor',
            'karma-jasmine',
            // 'requirejs'
        ],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // for $templateCache
        preprocessors: {
            // в files тоже надо указать
            'dev/app/_common/directives/**/*.html': ['ng-html2js']
        },
        // for $templateCache
        moduleName: function (htmlPath, originalPath) {
            var module = htmlPath.split('/')[0];
            return module !== 'tpl' ? module : null;
        },

        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'tests/unit/karma/derectives.js',
            'dev/app/_common/directives/**/*.html',
            //{pattern: 'tests/unit/karma/*.js', included: true}
        ],
        // list of files to exclude
        exclude: [],
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        port: 3333,
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
