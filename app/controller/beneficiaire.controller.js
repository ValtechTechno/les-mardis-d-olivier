(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', BeneficiaireController);

  function BeneficiaireController ($scope, beneficiairesService, commonService, $location) {

    commonService.init($scope, beneficiairesService);

    $scope.openBeneficiaireList = function () {
      $scope.resetAddBeneficiareForm();
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = {code: $scope.initNextCode()};
      $scope.currentPage = {beneficiaireList: true};
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope, beneficiaire);
    };

    $scope.addBeneficiaireFromList = function () {
      if ($scope.addBeneficiaire()) {
        $scope.resetAddBeneficiareForm();
        $scope.currentBeneficiaire = {code: $scope.initNextCode()};
      }
    };

    $scope.openBeneficiaireDetail = function(beneficiaire, fromDistribution) {
      $location.path("/beneficiaireDetail/"+beneficiaire.id);
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
        var nextId;
        if ($scope.beneficiaires.length == 0) {
          nextId = '1';
        } else {
          nextId = parseInt($scope.beneficiaires[$scope.beneficiaires.length - 1].id) + 1 + '';
        }
        var newBeneficiaire = {
          id: nextId,
          code: $scope.currentBeneficiaire.code,
          firstName: $scope.currentBeneficiaire.firstName,
          lastName: $scope.currentBeneficiaire.lastName,
          isPresent: false
        };
        $scope.beneficiaires.push(newBeneficiaire);
        return newBeneficiaire;
      } else {
        return false
      }
    }

    $scope.openBeneficiaireList();
  }

})();
