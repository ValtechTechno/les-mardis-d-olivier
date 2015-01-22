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
      .when('/beneficiaires/:beneficiaireId?', {
        controller: 'BeneficiaireDetailController',
        templateUrl: 'app/view/beneficiaireDetail.html'
      })
      .when('/about', {
        controller: 'AboutController',
        templateUrl: 'app/view/about.html',
        controllerAs: 'about'
      })
      .when('/about/edit', {
        controller: 'AboutEditController',
        templateUrl: 'app/view/aboutEdit.html',
        controllerAs: 'aboutEdit'
      })
      .otherwise({
        redirectTo: '/distributions'
      });
  }

})();
