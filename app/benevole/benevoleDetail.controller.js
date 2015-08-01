(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('BenevoleDetailController', BenevoleDetailController);

  function BenevoleDetailController ($scope, $routeParams, dataService, commonService, $location, $rootScope) {
    var GET_BENEVOLE_GENERIC_ERROR = 'Impossible de récupérer ce bénévole, une erreur technique est survenue.';

    $scope.openBenevoleDetail = function () {

      dataService.findBenevoleById($routeParams.benevoleId, $scope.benevoles)
        .then(function (doc) {
          $scope.currentBenevole = doc;
          $scope.edit = $rootScope.account.userId === $scope.currentBenevole._id || ($rootScope.account.isAdmin === true && !$scope.currentBenevole.isAdmin);
          if($scope.currentBenevole.englishLevel === undefined) {
            $scope.currentBenevole.englishLevel = $scope.languageLevels[0].id;
          }
          if($scope.currentBenevole.spanishLevel === undefined) {
            $scope.currentBenevole.spanishLevel = $scope.languageLevels[0].id;
          }
          if($scope.currentBenevole.germanLevel === undefined) {
            $scope.currentBenevole.germanLevel = $scope.languageLevels[0].id;
          }
        })
        .catch(function (err) {
          if (err.status === 404) {
            $scope.createBenevoleErrorWithReturnToList('Le bénévole n\'existe pas.');
          }else{
            $scope.createBenevoleErrorWithReturnToList(GET_BENEVOLE_GENERIC_ERROR);
          }
        });

      $scope.deletePopupButtons = [
        {text: "Supprimer", event: "confirmBenevoleDetailDeletePopup", close: true, style: "redButton"},
        {text: "Annuler", event: "", close: true, style: ""}
      ];
    };


    $scope.createBenevoleErrorWithReturnToList = function(message, technical) {
      $location.path("/benevoles");
      throw {
        type: technical === true ? "technical" : "functional",
        message: message
      };
    };

    $scope.saveBenevoleDetail = function () {
      // charge all the benevoles to check if there isn't already a couple of first name + last name
      dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.updateBenevole();
        })
        .catch(function () {
          throw {
            type: "functional",
            message: 'Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer."};'
          };
        });
    };

    $scope.updateBenevole = function () {
      if (commonService.benevoleFormValidation($scope.benevoles, $scope.currentBenevole.email, $scope.currentBenevole._id, true)) {
        dataService.addOrUpdateBenevole($scope.currentBenevole)
          .then(function () {
            $scope.openBenevoleList();
          }).catch(function (err) {
            if (err.status === 409) {
              throw {
                type: "functional",
                message: 'Un utilisateur vient de modifier ce bénévole. Veuillez recharger la page et recommencer.'
              };
            }
          });
      }
    };

    $scope.$on('confirmBenevoleDetailDeletePopup', function () {
      dataService.removeBenevole($scope.currentBenevole).then(function () {
        $scope.openBenevoleList();
      }).catch(function (err) {
        if (err.status === 409) {
          throw {
            type: "functional",
            message: 'Un utilisateur vient de modifier ce bénévole. Veuillez recharger la page et recommencer.'
          };
        }
      });
    });

    $scope.languageLevels = [
      {id:0, label:'Non parlé'},
      {id:1, label:'Débutant'},
      {id:2, label:'Intermédiaire'},
      {id:3, label:'Bilingue'}
    ];

    $scope.openBenevoleList = function () {
      $location.path("/benevoles");
    };

    $scope.openBenevoleDetail();
  }

})();
