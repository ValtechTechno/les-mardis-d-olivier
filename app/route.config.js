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
      .when('/distributions/:distributionId?', {
        controller: 'DistributionDetailController',
        templateUrl: 'app/view/distributionDetail.html'
      })
      .when('/beneficiaires', {
        controller: 'BeneficiaireController',
        templateUrl: 'app/view/beneficiaire.html'
      })
      .when('/beneficiaires/:beneficiaireId', {
        controller: 'BeneficiaireDetailController',
        templateUrl: 'app/view/beneficiaireDetail.html'
      })
      .when('/about', {
        controller: 'AboutController',
        templateUrl: 'app/about/about.html',
        controllerAs: 'about'
      })
      .when('/about/edit', {
        controller: 'AboutEditController',
        templateUrl: 'app/about/about.edit.html',
        controllerAs: 'aboutEdit'
      })
      .when('/export', {
        controller: 'ExportController',
        templateUrl: 'app/view/export.html'
      })
      .when('/import', {
        controller: 'ImportController',
        templateUrl: 'app/view/import.html'
      })
      .otherwise({
        redirectTo: '/distributions'
      });
  }

})();
