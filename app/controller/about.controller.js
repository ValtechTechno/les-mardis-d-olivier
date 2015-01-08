(function () {
  'use strict';

  mardisDolivier.controller('AboutController', function ($scope, $filter, beneficiairesService) {

    $scope.openAboutPage = function () {
      var aboutInformation = angular.fromJson(localStorage.getItem('aboutInformation'));
      if (aboutInformation != null) {
        $scope.aboutInformation = aboutInformation;
      }
      $scope.currentPage = {aboutPage: true};

    };

    $scope.openAboutPageUpdate = function () {
      $scope.currentPage = {aboutPageUpdate: true};
    };

    $scope.aboutPageSave = function () {
      localStorage.setItem('aboutInformation', angular.toJson($scope.aboutInformation));
      $scope.openAboutPage();
    };
    $scope.openAboutPage();
  })
})();
