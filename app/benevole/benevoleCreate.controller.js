(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('BenevoleCreateController', BenevoleCreateController);

  function BenevoleCreateController($scope, dataService, commonService, $location) {

    $scope.addBenevoleFromNoAuth = function () {
      $scope.addBenevole();
    };

    $scope.openBenevoleCreate = function () {
      if ($scope.benevoles === null || $scope.benevoles === undefined) {
        $scope.benevoles = [];
        $scope.associations = [];
        $scope.antennes = [];
        $scope.antennesFiltered = [];
      }
      dataService.findAllBenevoleAntenne()
        .then(function (benevoleAntenne) {
          $scope.benevoleAntenne = benevoleAntenne;
        })
        .catch(function () {
          throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
        });
      dataService.findAllBenevoles()
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.currentBenevole = {};
        })
        .catch(function () {
          throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
        });
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
          if ($scope.associations.length === 0) {
            throw {type: "functional", message: 'Veuillez créer une association avant de créer un compte bénévole.'};
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
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des antennes.'};
        });
    };

    $scope.updateAntenneList = function () {
      $scope.antennesFiltered = [];
      if ($scope.currentBenevole.association === undefined) {
        return false;
      }
      for (var antenneIndex = 0; antenneIndex < $scope.antennes.length; antenneIndex++) {
        if ($scope.currentBenevole.association._id === $scope.antennes[antenneIndex].associationId) {

          $scope.handleExistingAdmin($scope.antennes[antenneIndex]);
          $scope.antennesFiltered.push($scope.antennes[antenneIndex]);

        }
      }
      if ($scope.antennesFiltered.length === 0) {
        throw {type: "functional", message: 'Veuillez créer une antenne pour l\'association ' + $scope.currentBenevole.association.name + ' avant de créer un compte bénévole.'};
      }
    };

    $scope.handleExistingAdmin = function (antenne) {
      for (var benevoleAntenneIndex = 0; benevoleAntenneIndex < $scope.benevoleAntenne.length; benevoleAntenneIndex++) {
        if (antenne._id === $scope.benevoleAntenne[benevoleAntenneIndex].antenneId) {
          antenne.hasAdmin = true;
          antenne.name = antenne.name +" ("+$scope.getAdminDisplayName($scope.benevoleAntenne[benevoleAntenneIndex].benevoleId)+")";
          return antenne;
        }
      }
    };

      $scope.getAdminDisplayName = function (benevoleId) {
        for (var benevoleIndex = 0; benevoleIndex < $scope.benevoles.length; benevoleIndex++) {
          if ($scope.benevoles[benevoleIndex]._id === benevoleId) {
            return $scope.benevoles[benevoleIndex].firstName + " " + $scope.benevoles[benevoleIndex].lastName;
          }
        }
      };

      $scope.addBenevole = function () {
        if($scope.currentBenevole.password !== $scope.currentBenevole.passwordConfirmation){
          throw {type: "functional", message: 'Le mot de passe n\'est pas identique à la confirmation.'};
        }

        if (commonService.benevoleFormValidation($scope.benevoles, $scope.currentBenevole.email, $scope.currentBenevole._id, false)) {
          var newBenevole = getNewAdminBenevole(getNextIdInUnsortedList($scope.benevoles), $scope.currentBenevole.lastName, $scope.currentBenevole.firstName, $scope.currentBenevole.email, $scope.currentBenevole.phoneNumber, $scope.currentBenevole.password);
          dataService.addOrUpdateBenevole(newBenevole)
            .then(function (added) {
              // we create one object with only ids to format in the data.service
              dataService.addOrUpdateBenevoleAntenne(getNextIdInUnsortedList($scope.benevoleAntenne), added._id, $scope.currentBenevole.antenne._id)
                .then(function () {
                  $location.path("/login");
                })
            })
            .catch(function () {
              throw {type: "functional", message: 'Le bénévole n\'a pas été ajouté suite à une erreur technique.'};
            });
        }
      };

    $scope.confirmPassword = function(password, passwordConfirmation) {
      var isPasswordTheSame = password === passwordConfirmation && password.length !== 0 &&  passwordConfirmation.length !== 0;
      $scope.addBenevoleForm.password.$setValidity('addressNotValid', isPasswordTheSame);
      $scope.addBenevoleForm.passwordConfirmation.$setValidity('addressNotValid', isPasswordTheSame);
    };

    $scope.openBenevoleCreate();

  }

})();
