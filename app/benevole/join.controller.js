(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('JoinController', JoinController);

  function JoinController($scope, dataService, $rootScope, $location, LoginService, $injector) {

    $scope.join = function () {
      $scope.benevole.antenneId = $scope.currentBenevole.antenne._id;
      $scope.benevole.associationId = $scope.currentBenevole.association._id;
      $scope.benevole.isAdmin = $scope.currentBenevole.antenne.hasAdmin === false;
      $scope.benevole.toValidate = $scope.currentBenevole.antenne.hasAdmin === true;
      dataService.addOrUpdateBenevole($scope.benevole)
        .then(function (benev) {
          if($scope.benevole.toValidate === true){
            LoginService.logout();
            var toaster = $injector.get("toaster");
            toaster.pop('success', null, "Demande de rattachement envoyée aux administrateurs de l\'antenne.");
          }else {
            $rootScope.account.associationId = benev.associationId;
            $rootScope.account.antenneId = benev.antenneId;
            $rootScope.account.isAdmin = true;
            $rootScope.account.antenne = $scope.currentBenevole.antenne;
            LoginService.saveSessionCookie();
            $location.path('/');
          }
        }).catch(function (err) {
          if (err.type !== "functional") {
            throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
          }
        });
    };

    $scope.openJoin = function () {
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
          dataService.findBenevoleById($rootScope.account.userId)
            .then(function (benev) {
              $scope.benevole = benev;
            })
            .catch(function (err) {
              if (err.type !== "functional") {
                throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
              }
            });
          $scope.findAssociations();
        })
        .catch(function () {
          throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
        });

      $scope.findAssociations = function () {
        dataService.findAllAssociations()
          .then(function (associations) {
            $scope.associations = associations;
            if ($scope.associations.length === 0) {
              // throw {type: "functional", message: 'Veuillez créer une association.'};
            }
            $scope.findAntennes();
          })
          .catch(function (err) {
            if (err.type !== "functional") {
              throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
            }
          });
      };
    };

    $scope.findAntennes = function () {
      dataService.findAllAntennes()
        .then(function (antennes) {
          for (var antenneIndex = 0; antenneIndex < antennes.length; antenneIndex++) {
            $scope.handleExistingAdmin(antennes[antenneIndex]);
          }
          $scope.antennes = antennes;
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des antennes.'};
        });
    };

    $scope.handleExistingAdmin = function (antenne) {
      for (var benevoleAntenneIndex = 0; benevoleAntenneIndex < $scope.benevoles.length; benevoleAntenneIndex++) {
        antenne.hasAdmin = false;
        if (antenne._id === $scope.benevoles[benevoleAntenneIndex].antenneId && $scope.benevoles[benevoleAntenneIndex].isAdmin === true) {
          antenne.hasAdmin = true;
          antenne.name = antenne.name + " (" + $scope.benevoles[benevoleAntenneIndex].firstName + " " + $scope.benevoles[benevoleAntenneIndex].lastName + ")";
        }
      }
    };


    $scope.updateAntenneList = function () {
      $scope.antennesFiltered = [];
      if ($scope.currentBenevole.association === undefined) {
        return false;
      }
      for (var antenneIndex = 0; antenneIndex < $scope.antennes.length; antenneIndex++) {
        if ($scope.currentBenevole.association._id === $scope.antennes[antenneIndex].associationId) {
          $scope.antennesFiltered.push($scope.antennes[antenneIndex]);
        }
      }
      if ($scope.antennesFiltered.length === 0) {
        //throw {type: "functional", message: 'Veuillez créer une antenne pour l\'association ' + $scope.currentBenevole.association.name + '.'};
      }
    };

    $scope.openJoin();

  }

})();
