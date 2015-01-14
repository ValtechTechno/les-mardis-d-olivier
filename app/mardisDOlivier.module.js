(function () {
  'use strict';

  angular.module('mardisDolivier', ['ui.date', 'ngRoute']);

  angular
      .module('mardisDolivier')
      .run(function ($location) {
    $location.path("/distribution");
  });

})();

