(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .config(routeConfiguration);

  function routeConfiguration ($routeProvider) {
    $routeProvider
      .when('/distributions', {
        controller: 'DistributionController',
        templateUrl: 'app/view/distribution.html'
      })
      .when('/beneficiaires', {
        controller: 'BeneficiaireController',
        templateUrl: 'app/view/beneficiaire.html'
      })
      .when('/about', {
        controller: 'AboutController',
        templateUrl: 'app/view/about.html'
      })
      .otherwise({
        redirectTo: '/distributions'
      });
  }

})();
