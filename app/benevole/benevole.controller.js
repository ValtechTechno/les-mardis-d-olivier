(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('BenevoleController', BenevoleController);

  function BenevoleController ($scope, dataService, commonService, $location, $rootScope) {
    $scope.openBenevoleList = function () {
      if ($scope.benevoles === null || $scope.benevoles === undefined) {
        $scope.benevoles = [];
      }
      dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.resetAddBenevoleForm();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
        });
    };

    $scope.searchBenevole = function (benevole) {
      return commonService.searchBenevole($scope.searchText, benevole);
    };

    $scope.addBenevoleFromList = function () {
      $scope.addBenevole();
    };

    $scope.openBenevoleDetail = function(benevoleId) {
      $location.path("/benevoles/" + benevoleId);
    };

    $scope.resetAddBenevoleForm = function() {
      $scope.currentBenevole = {};
      if($scope.addBenevoleForm !== undefined) {
        $scope.addBenevoleForm.$setPristine();
      }
    };

    $scope.addBenevole = function () {
      if (commonService.benevoleFormValidation($scope.benevoles, $scope.currentBenevole.email, $scope.currentBenevole._id, false)) {
        var newBenevole = getNewBenevole($scope.currentBenevole.lastName, $scope.currentBenevole.firstName, $scope.currentBenevole.email, $scope.currentBenevole.phoneNumber, $rootScope.account.associationId, $rootScope.account.antenneId);
        dataService.addOrUpdateBenevole(newBenevole)
          .then(function (added) {
            $scope.benevoles.push(added);
            $scope.resetAddBenevoleForm();
          })
          .catch(function () {
            throw {type: "functional", message: 'Le bénévole n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.openBenevoleList();
  }

})();
