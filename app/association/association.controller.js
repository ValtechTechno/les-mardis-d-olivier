(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AssociationController', AssociationController);

  function AssociationController ($scope, dataService, commonService) {
    $scope.openAssociationList = function () {
      if ($scope.associations === null || $scope.associations === undefined) {
        $scope.associations = [];
      }
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
          $scope.resetAddAssociationForm();
        })
        .catch(function () {
            throw {type: "functional", message: 'Impossible de charger la liste des associations.'};
        });
    };

    $scope.searchAssociation = function (association) {
      return commonService.searchAssociation($scope.searchText, association);
    };

    $scope.addAssociationFromList = function () {
      $scope.addAssociation();
    };

    $scope.resetAddAssociationForm = function() {
      $scope.currentAssociation = {name:undefined};
    };

    $scope.addAssociation = function () {
      if (commonService.associationFormValidation($scope.associations, $scope.currentAssociation.name)) {
        var newAssociation = getNewAssociation(getNextIdInUnsortedList($scope.associations), $scope.currentAssociation.name);
        dataService.addOrUpdateAssociation(newAssociation)
          .then(function (added) {
            $scope.associations.push(added);
            $scope.resetAddAssociationForm();
          })
          .catch(function () {
              throw {type: "functional", message: 'L`\'association n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.openAssociationList();
  }

})();
