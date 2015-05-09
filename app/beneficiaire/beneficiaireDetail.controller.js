(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, dataService, commonService, $location) {
    $scope.openBeneficiaireDetail = function () {
      dataService.findBeneficiaireById($routeParams.beneficiaireId, $scope.beneficiaires)
      .then(function (doc) {
        $scope.currentBeneficiaire = doc;
        $scope.currentBeneficiaire.codeNumber = Number($scope.currentBeneficiaire.code);
        $scope.getComments();
        $scope.currentBeneficiaire.visiteNumber = $scope.getVisiteNumber($scope.currentBeneficiaire._id);
        // By default, an old user has a card.
        if ($scope.currentBeneficiaire.hasCard === undefined) {
          $scope.currentBeneficiaire.hasCard = true;
        }
      }).catch(function (err) {
          if(err.status === 404) {
            $scope.openBeneficiaireList();
            throw {type: "functional", message: 'Le bénéficiaire n\'existe pas.'};
          }
      });
      $scope.deletePopupButtons = [
        {text: "Supprimer", event: "confirmBeneficiaireDetailDeletePopup", close: true, style: "redButton"},
        {text: "Annuler", event: "", close: true, style: ""}
      ];
    };

    $scope.isBookmark = function (comment) {
      var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].distributionId == comment.distributionId && beneficiairesPresentByDistribution[i].beneficiaireId == $scope.currentBeneficiaire._id){
          beneficiairesPresentByDistribution[i].isBookmark = comment.isBookmark;
          break;
        }
      }
      dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
    };

    $scope.getVisiteNumber = function(beneficiaireId) {
      var visiteNumber = 0;
      var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId){
          visiteNumber++;
        }
      }
      return visiteNumber;
    };

    $scope.getComments = function(){
      $scope.currentBeneficiaire.comments = getLastComments($scope.currentBeneficiaire._id, -1, dataService, false);
    };

    $scope.saveBeneficiaireDetail = function () {
      dataService.loadBeneficiaires().then(function (beneficiaires) {
        $scope.beneficiaires = beneficiaires;
        if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire._id, true)) {
          dataService.addOrUpdateBeneficiaire($scope.currentBeneficiaire).then(function() {
            $scope.openBeneficiaireList();
          }).catch(function (err) {
            if(err.status === 409) {
              throw {type: "functional", message: 'Un utilisateur vient de modifier ce bénéficiaire. Veuillez recharger la page et recommencer.'};
            }
          });
        }
      });
    };

    $scope.$on('confirmBeneficiaireDetailDeletePopup', function () {
      dataService.deleteBeneficiaire($scope.currentBeneficiaire).then(function () {
        var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
        var newBeneficiairesPresentByDistribution = [];
        for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
          if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire._id) {
            newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
          }
        }
        dataService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);
        $scope.openBeneficiaireList();
      }).catch(function (err) {
        if (err.status === 409) {
          throw {
            type: "functional",
            message: 'Un utilisateur vient de modifier ce bénéficiaire. Veuillez recharger la page et recommencer.'
          };
        }
      });
    });

    $scope.openBeneficiaireList = function () {
      $location.path("/beneficiaires");
    };

    $scope.openBeneficiaireDetail();
  }

})();
