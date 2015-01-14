(function () {
  'use strict';

  angular.module('mardisDolivier', ['ui.date', 'ngRoute']);

  angular
      .module('mardisDolivier')
      .run(setInitialPathToDistribution);

  function setInitialPathToDistribution ($location) {
    $location.path("/distribution");
  }

})();

