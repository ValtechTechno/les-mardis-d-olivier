(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', BeneficiaireController);

  function BeneficiaireController ($scope, dataService, commonService, $location) {
    $scope.openBeneficiaireList = function () {
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.resetAddBeneficiareForm();
      $scope.excludedFilter = false;
      $scope.hasCardFilter = false;
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope.searchText, beneficiaire);
    };

    $scope.searchExcluded = function (beneficiaire) {
      return ($scope.excludedFilter == true && beneficiaire.excluded == true) || ($scope.excludedFilter == false);
    };

    $scope.searchHasCard = function (beneficiaire) {
      return ($scope.hasCardFilter == true && beneficiaire.hasCard == false) || ($scope.hasCardFilter == false);
    };

    $scope.addBeneficiaireFromList = function () {
      if ($scope.addBeneficiaire()) {
        $scope.resetAddBeneficiareForm();
      }
    };

    $scope.openBeneficiaireDetail = function(beneficiaireId) {
      $location.path("/beneficiaires/" + beneficiaireId);
    };

    $scope.resetAddBeneficiareForm = function() {
      $scope.currentBeneficiaire = {code: $scope.initNextCode(), hasCard: false};
      $scope.currentError = {};
    };

    $scope.initNextCode = function() {
      var nextCode = 1;
      if ($scope.beneficiaires != null) {
        for (var i = 0; i < $scope.beneficiaires.length; i++) {
          if (nextCode <= $scope.beneficiaires[i].code) {
            nextCode = $scope.beneficiaires[i].code;
            nextCode++;
          }
        }
      }
      return nextCode;
    };

    $scope.addBeneficiaire = function() {
      if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire.id, false)) {
        var newBeneficiaire = getNewBeneficiaire(getNextId($scope.beneficiaires),$scope.currentBeneficiaire.code, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire.hasCard);
        $scope.beneficiaires.push(newBeneficiaire);
        dataService.saveBeneficiaires($scope.beneficiaires);
        return newBeneficiaire;
      }
      return false
    };

    $scope.openBeneficiaireList();
  }

})();
