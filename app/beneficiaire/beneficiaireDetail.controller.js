(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, dataService, commonService, $location) {
    $scope.openBeneficiaireDetail = function () {
      $scope.beneficiaires = dataService.loadBeneficiaires();
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
      if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire._id, true)) {
        var beneficiaires = dataService.loadBeneficiaires();
        for (var i = 0; i < beneficiaires.length; i++) {
          if (beneficiaires[i]._id == $scope.currentBeneficiaire._id) {
            beneficiaires[i] = $scope.currentBeneficiaire;
            break;
          }
        }
        dataService.saveBeneficiaires(beneficiaires);
        $scope.openBeneficiaireList();
      }
    };

    $scope.$on('confirmBeneficiaireDetailDeletePopup', function () {
      var beneficiaires = dataService.loadBeneficiaires();
      var beneficiaireToDeletePosition = -1;
      for (var pos = 0; pos < beneficiaires.length; pos++) {
        if (beneficiaires[pos]._id == $scope.currentBeneficiaire._id) {
          beneficiaireToDeletePosition = pos;
          break;
        }
      }
      beneficiaires.splice(beneficiaireToDeletePosition, 1);
      dataService.saveBeneficiaires(beneficiaires);

      var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
      var newBeneficiairesPresentByDistribution = [];
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire._id) {
          newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
        }
      }
      dataService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);

      $scope.openBeneficiaireList();
    });

    $scope.openBeneficiaireList = function () {
      $location.path("/beneficiaires");
    };

    $scope.openBeneficiaireDetail();
  }

})();
