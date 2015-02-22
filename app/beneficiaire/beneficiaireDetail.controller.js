(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, dataService, commonService, $location) {
    $scope.openBeneficiaireDetail = function () {
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.currentBeneficiaire = dataService.findBeneficiaireById($routeParams.beneficiaireId, $scope.beneficiaires);
      $scope.currentBeneficiaire.codeNumber = Number($scope.currentBeneficiaire.code);
      $scope.getComments();
      $scope.currentBeneficiaire.visiteNumber = $scope.getVisiteNumber($scope.currentBeneficiaire.id);
      // By default, an old user has a card.
      if ($scope.currentBeneficiaire.hasCard == undefined) {
        $scope.currentBeneficiaire.hasCard = true;
      }
      $scope.deletePopupButtons = [
        {text: "Supprimer", event: "confirmBeneficiaireDetailDeletePopup", close: true, style: "redButton"},
        {text: "Annuler", event: "", close: true, style: ""}
      ];
    };

    $scope.isBookmark = function (comment) {
      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].distributionId == comment.distributionId && beneficiairesPresentByDistribution[i].beneficiaireId == $scope.currentBeneficiaire.id){
          beneficiairesPresentByDistribution[i].isBookmark = comment.isBookmark;
          break;
        }
      }
      dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
    };

    $scope.getVisiteNumber = function(beneficiaireId) {
      var visiteNumber = 0;
      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId){
          visiteNumber++;
        }
      }
      return visiteNumber;
    };

    $scope.getComments = function(){
      $scope.currentBeneficiaire.comments = getLastComments($scope.currentBeneficiaire.id, -1, dataService, false);
    };

    $scope.saveBeneficiaireDetail = function () {
      if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire.id, true)) {
        var beneficiaires = dataService.loadBeneficiaires();
        for (var i = 0; i < beneficiaires.length; i++) {
          if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
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
      for (var i = 0; i < beneficiaires.length; i++) {
        if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
          beneficiaireToDeletePosition = i;
          break;
        }
      }
      beneficiaires.splice(beneficiaireToDeletePosition, 1);
      dataService.saveBeneficiaires(beneficiaires);

      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      var newBeneficiairesPresentByDistribution = [];
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire.id) {
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
