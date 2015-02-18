// Karma configuration
// Generated on Thu Jul 31 2014 20:08:30 GMT+0200 (CEST)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'lib/foundation-5.4.5/js/vendor/modernizr.js',
      'lib/foundation-5.4.5/js/vendor/jquery.js',
      'lib/jquery-ui-1.11.0.custom/jquery-ui.min.js',
      'lib/jquery-ui-1.11.0.custom/ui/i18n/datepicker-fr.js',
      'lib/angular-1.3.9/angular.min.js',
      'lib/angular-1.3.9/angular-route.min.js',
      'lib/angular-ui-date-0.0.7/date.min.js',
      'lib/foundation-5.4.5/js/foundation.min.js',
      'app/mardisDOlivier.module.js',
      'app/datePicker.filter.js',
      'app/beneficiaire/beneficiaire.controller.js',
      'app/beneficiaire/beneficiaireDetail.controller.js',
      'app/data/data.service.js',
      'app/distribution/distribution.controller.js',
      'app/distribution/distributionDetail.controller.js',
      'app/menu.controller.js',
      'app/about/about.controller.js',
      'app/about/about.edit.controller.js',
      'app/common.service.js',
      'tests/angular-mocks.js',
      'tests/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
