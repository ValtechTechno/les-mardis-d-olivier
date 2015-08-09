(function () {
    'use strict';

    angular
        .module('mardisDolivier')
        .config(translateConfiguration);

    function translateConfiguration($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: '/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('fr_FR');
    }

    angular
      .module('mardisDolivier')
    .config(function(calendarConfigProvider) {

      calendarConfigProvider.setDateFormatter('moment'); // use moment to format dates

    });

})();
