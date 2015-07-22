(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('AntenneController', AntenneController);

  function AntenneController($scope, dataService, commonService) {
    $scope.openAntenneList = function () {
      if ($scope.associations === null || $scope.associations === undefined) {
        $scope.associations = [];
      }
      if ($scope.antennes === null || $scope.antennes === undefined) {
        $scope.antennes = [];
      }
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
          if ($scope.associations.length === 0) {
            throw {type: "functional", message: 'Veuillez créer une association avant de créer une antenne.'};
          }
          $scope.findInstances();
        })
        .catch(function (err) {
          if (err.type !== "functional") {
            throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
          }
        });

    };

    $scope.findInstances = function () {
      dataService.findAllAntennes()
        .then(function (antennes) {
          $scope.antennes = antennes;
          for (var antenneIndex = 0; antenneIndex < $scope.antennes.length; antenneIndex++) {
            var associationName = $scope.getAssociationName($scope.antennes[antenneIndex].associationId);
            if (associationName === undefined) {
              continue;
            }
            $scope.antennes[antenneIndex].associationName = associationName;
          }
          $scope.resetAddAntenneForm();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des antennes.'};
        });
    };

    $scope.getAssociationName = function (associationId) {
      for (var associationIndex = 0; associationIndex < $scope.associations.length; associationIndex++) {
        if (associationId === $scope.associations[associationIndex]._id) {
          return $scope.associations[associationIndex].name;
        }
      }
      return undefined;
    };

    $scope.searchAntenne = function (antenne) {
      return commonService.searchAntenne($scope.searchText, antenne);
    };

    $scope.addAntenneFromList = function () {
      $scope.addAntenne();
    };

    $scope.resetAddAntenneForm = function () {
      $scope.currentAntenne = {name: undefined};
    };

    $scope.addAntenne = function () {
      if (commonService.antenneFormValidation($scope.antennes, $scope.currentAntenne.association, $scope.currentAntenne.name)) {
        var newAntenne = getNewAntenne($scope.currentAntenne.association, $scope.currentAntenne.name);
        dataService.addOrUpdateAntenne(newAntenne)
          .then(function (added) {
              added.associationName = $scope.getAssociationName(added.associationId);
              $scope.antennes.push(added);
            $scope.resetAddAntenneForm();
          })
          .catch(function () {
            throw {type: "functional", message: 'L`\'antenne n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.openAntenneList();
  }

})();
