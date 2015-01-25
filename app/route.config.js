(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .config(routeConfiguration);

  function routeConfiguration ($routeProvider) {
    $routeProvider
      .when('/distributions', {
        controller: 'DistributionController',
        templateUrl: 'app/distribution/distribution.html'
      })
      .when('/distributions/:distributionId?', {
        controller: 'DistributionDetailController',
        templateUrl: 'app/distribution/distributionDetail.html'
      })
      .when('/beneficiaires', {
        controller: 'BeneficiaireController',
        templateUrl: 'app/beneficiaire/beneficiaire.html'
      })
      .when('/beneficiaires/:beneficiaireId', {
        controller: 'BeneficiaireDetailController',
        templateUrl: 'app/beneficiaire/beneficiaireDetail.html'
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
        templateUrl: 'app/export/export.html'
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
