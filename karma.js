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
      'lib/foundation-5.5.1/js/vendor/modernizr.js',
      'lib/foundation-5.5.1/js/vendor/jquery.js',
      'lib/jquery-ui-1.11.0.custom/jquery-ui.min.js',
      'lib/jquery-ui-1.11.0.custom/ui/i18n/datepicker-fr.js',
      'lib/angular-1.4.3/angular.min.js',
      'lib/angular-1.4.1/angular-animate.min.js',
      'lib/angular-1.4.1/angular-route.min.js',
      'lib/angular-ui-date-0.0.8/date.js',
      'lib/foundation-5.5.1/js/foundation.min.js',
      'lib/angularjs-toaster-0.4.14/toaster.min.js',
      'lib/translate/angular-translate.min.js',
      'lib/translate/angular-translate-loader-static-files.min.js',
      'lib/translate/angular-messages.min.js',
      'lib/angular-http-auth/http-auth-interceptor.js',
      'lib/angular-local-storage/angular-local-storage.min.js',
      'lib/pouchdb/pouchdb.min.js',
      'lib/angular-uuid/angular-uuid.js',
      'app/mardisDOlivier.module.js',
      'app/datePicker.filter.js',
      'app/beneficiaire/beneficiaire.controller.js',
      'app/beneficiaire/beneficiaireDetail.controller.js',
      'app/data/data.service.js',
      'app/distribution/distribution.controller.js',
      'app/distribution/distributionDetail.controller.js',
      'app/error.config.js',
      'app/menu.controller.js',
      'app/about/about.controller.js',
      'app/about/about.edit.controller.js',
      'app/common.service.js',
      'app/login/login.controller.js',
      'app/login/login.service.js',
      'app/benevole/benevole.controller.js',
      'app/benevole/benevoleDetail.controller.js',
      'app/benevole/benevoleCreate.controller.js',
      'app/association/association.controller.js',
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
