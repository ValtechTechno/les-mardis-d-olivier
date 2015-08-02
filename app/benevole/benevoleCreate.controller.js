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
      $scope.edit = true;
      if ($scope.benevoles === null || $scope.benevoles === undefined) {
        $scope.benevoles = [];
        $scope.associations = [];
        $scope.antennes = [];
        $scope.antennesFiltered = [];
      }

      dataService.findAllBenevoles()
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.currentBenevole = {};
        })
        .catch(function () {
          throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
        });
    };

    $scope.handleExistingAdmin = function (antenne) {
      for (var benevoleAntenneIndex = 0; benevoleAntenneIndex < $scope.benevoles.length; benevoleAntenneIndex++) {
        if (antenne._id === $scope.benevoles[benevoleAntenneIndex].antenneId) {
          antenne.hasAdmin = true;
          antenne.name = antenne.name +" ("+$scope.benevoles[benevoleAntenneIndex].firstName + " " + $scope.benevoles[benevoleAntenneIndex].lastName+")";
        }
      }
    };

    $scope.addBenevole = function () {
      if($scope.currentBenevole.password !== $scope.currentBenevole.passwordConfirmation){
        throw {type: "functional", message: 'Le mot de passe n\'est pas identique à la confirmation.'};
      }

      if (commonService.benevoleFormValidation($scope.benevoles, $scope.currentBenevole.email, $scope.currentBenevole._id, false)) {
        var newBenevole = getNewAccount($scope.currentBenevole.lastName, $scope.currentBenevole.firstName, $scope.currentBenevole.email, $scope.currentBenevole.phoneNumber, undefined, undefined, CryptoJS.SHA256($scope.currentBenevole.password).toString());
        dataService.addOrUpdateBenevole(newBenevole)
          .then(function () {
             $location.path("/login");
          })
          .catch(function () {
            throw {type: "functional", message: 'Le bénévole n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.confirmPassword = function(password, passwordConfirmation) {
      var isPasswordTheSame = password !== undefined && passwordConfirmation !== undefined && password === passwordConfirmation && password.length !== 0 && passwordConfirmation.length !== 0;
      $scope.addBenevoleForm.password.$setValidity('addressNotValid', isPasswordTheSame);
      $scope.addBenevoleForm.passwordConfirmation.$setValidity('addressNotValid', isPasswordTheSame);
    };

    $scope.openBenevoleCreate();

  }

})();
