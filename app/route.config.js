(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .config(routeConfiguration);

  function routeConfiguration ($routeProvider) {
    $routeProvider
      .when('/distribution', {
        controller: 'DistributionController',
        templateUrl: 'app/view/distribution.html'
      })
      .when('/beneficiaire', {
        controller: 'BeneficiaireController',
        templateUrl: 'app/view/beneficiaire.html'
      })
      .when('/about', {
        controller: 'AboutController',
        templateUrl: 'app/view/about.html'
      });
  }

})();
