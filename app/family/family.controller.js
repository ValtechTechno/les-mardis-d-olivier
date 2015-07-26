(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('FamilyController', FamilyController);

  function FamilyController ($scope, dataService, commonService, $location, $rootScope) {
    $scope.openFamilyList = function () {
      if ($scope.families === null || $scope.families === undefined) {
        $scope.families = [];
      }
      dataService.findAllFamiliesByAntenneId($rootScope.account.antenneId)
        .then(function (families) {
          $scope.families = families;
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
        });
    };

    $scope.addFamily = function () {
      $location.path('/familyDetail/0');
    };

    $scope.searchFamily = function (family) {
      return commonService.searchFamily($scope.searchText, family);
    };

    $scope.openFamilyDetail = function(familyId) {
      $location.path("/familyDetail/" + familyId);
    };

    $scope.openFamilyList();
  }

})();
