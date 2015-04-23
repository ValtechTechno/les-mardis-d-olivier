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
      return ($scope.excludedFilter === true && beneficiaire.excluded === true) || ($scope.excludedFilter === false);
    };

    $scope.searchHasCard = function (beneficiaire) {
      return ($scope.hasCardFilter === true && beneficiaire.hasCard === false) || ($scope.hasCardFilter === false);
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
      $scope.currentBeneficiaire = {code: $scope.initNextCode(), hasCard: true};
    };

    $scope.initNextCode = function() {
      var nextCode = 1;
      $scope.beneficiaires.then(function(beneficiaires) {
        for (var i = 0; i < beneficiaires.length; i++) {
          if (nextCode <= beneficiaires[i].code) {
            nextCode = beneficiaires[i].code;
            nextCode++;
          }
        }
        return nextCode;
      });
    };

    $scope.addBeneficiaire = function() {
      if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire._id, false)) {
        var newBeneficiairePromise = getNewBeneficiaire(getNextId($scope.beneficiaires),$scope.currentBeneficiaire.code, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire.hasCard);
        $scope.beneficiaires.then(function (datas) {
          return newBeneficiairePromise.then(function(newBeneficiaire) {
            datas.push(newBeneficiaire);
            dataService.saveBeneficiaires(datas);
            return newBeneficiaire;
          }).catch(function (error) {
            return false;
          });
        }).catch(function (error) {
          return false;
        });
      }
      return false;
    };

    $scope.openBeneficiaireList();
  }

})();
