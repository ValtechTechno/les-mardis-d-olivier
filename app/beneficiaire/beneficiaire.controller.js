(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', BeneficiaireController);

  function BeneficiaireController ($scope, beneficiairesService, commonService, $location) {
    $scope.openBeneficiaireList = function () {
      $scope.resetAddBeneficiareForm();
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = {code: $scope.initNextCode()};
      $scope.excludedFilter = false;
      $scope.hasCardFilter = false;
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope, beneficiaire);
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
        $scope.currentBeneficiaire = {code: $scope.initNextCode()};
      }
    };

    $scope.openBeneficiaireDetail = function(beneficiaireId) {
      $location.path("/beneficiaires/" + beneficiaireId);
    }

    // add form

    $scope.resetAddBeneficiareForm = function() {
      $scope.currentError = {};
    }

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
    }

    $scope.addBeneficiaire = function() {
      if (commonService.userFormValidation($scope, false)) {
        var newBeneficiaire = getNewBeneficiaire(getNextId($scope.beneficiaires),$scope.currentBeneficiaire.code, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName)
        $scope.beneficiaires.push(newBeneficiaire);
        beneficiairesService.saveBeneficiaires($scope.beneficiaires);
        return newBeneficiaire;
      }
      return false
    }

    $scope.hasUserCardLabel = function(value) {
      if(value == true || value == undefined){
        return "OUI";
      }
      return "NON";
    }

    $scope.isUserExludedLabel = function(value) {
      if(value == true){
        return "OUI";
      }
      return "NON";
    }


    $scope.openBeneficiaireList();
  }

})();
