(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .config(routeConfiguration);

  function routeConfiguration ($routeProvider) {
    $routeProvider
      .when('/login', {
        controller: 'LoginController',
        templateUrl: 'app/login/login.html'
      })
      .when('/distributions', {
        controller: 'DistributionController',
        templateUrl: 'app/distribution/distribution.html'
      })
      .when('/distributions/:distributionId?', {
        controller: 'DistributionDetailController',
        controllerAs: 'distributionDetail',
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
      .when('/benevoles', {
        controller: 'BenevoleController',
        templateUrl: 'app/benevole/benevole.html'
      })
      .when('/benevoles/:benevoleId', {
        controller: 'BenevoleDetailController',
        templateUrl: 'app/benevole/benevoleDetail.html'
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
        templateUrl: 'app/import/import.html'
      })
      .when('/noauth/createAssociation', {
        controller: 'AssociationController',
        templateUrl: 'app/association/association.html'
      })
      .when('/noauth/createAntenne', {
        controller: 'AntenneController',
        templateUrl: 'app/antenne/antenne.html'
      })
      .when('/createAssociation', {
        controller: 'AssociationController',
        templateUrl: 'app/association/association.html'
      })
      .when('/createAntenne', {
        controller: 'AntenneController',
        templateUrl: 'app/antenne/antenne.html'
      })
      .when('/noauth/createBenevole', {
        controller: 'BenevoleCreateController',
        templateUrl: 'app/benevole/benevoleCreate.html'
      })
      .when('/join', {
        controller: 'JoinController',
        templateUrl: 'app/benevole/join.html'
      })
      .when('/families', {
        controller: 'FamilyController',
        templateUrl: 'app/family/family.html'
      })
      .when('/familyDetail/:familyId', {
        controller: 'FamilyDetailController',
        templateUrl: 'app/family/familyDetail.html'
      })
      .when('/admin/activities', {
        controller: 'ActivitiesAdminController',
        templateUrl: 'app/activities/activitiesAdmin.html'
      })
      .when('/resp/activities', {
        controller: 'ActivitiesRespController',
        templateUrl: 'app/activities/activitiesResp.html'
      })
      .when('/member/activities', {
        controller: 'ActivitiesMemberController',
        templateUrl: 'app/activities/activitiesMember.html'
      })
      .otherwise({
        redirectTo: '/distributions'
      });
  }

})();
