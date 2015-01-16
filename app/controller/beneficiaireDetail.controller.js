(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, beneficiairesService, commonService, $location) {

    commonService.init($scope, beneficiairesService);

    $scope.openBeneficiaireDetail = function () {
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = beneficiairesService.findBeneficiaireById($routeParams.beneficiaireId, $scope.beneficiaires);
    };

    $scope.cancelBeneficiaireDetail = function () {
      if ($scope.fromDistribution == true) {
        $scope.loadDistribution($scope.currentDistribution.id, $scope.readOnly);
      } else {
        $scope.openBeneficiaireList();
      }
    };

    $scope.saveBeneficiaireDetail = function () {
      if (commonService.userFormValidation($scope, true)) {
        var beneficiaires = beneficiairesService.loadBeneficiaires();
        for (var i = 0; i < beneficiaires.length; i++) {
          if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
            beneficiaires[i] = $scope.currentBeneficiaire;
            break;
          }
        }
        beneficiairesService.saveBeneficiaires(beneficiaires);
        $scope.cancelBeneficiaireDetail();
      }
    };

    $scope.deleteBeneficiaireDetail = function () {
      $('#confirmDeletePopup').foundation('reveal', 'open');
    };

    $scope.cancelBeneficiaireDetailDeletePopup = function () {
      $('#confirmDeletePopup').foundation('reveal', 'close');
    }

    $scope.confirmBeneficiaireDetailDeletePopup = function () {
      $('#confirmDeletePopup').foundation('reveal', 'close');
      var beneficiaires = beneficiairesService.loadBeneficiaires();
      var beneficiaireToDeletePosition = -1;
      for (var i = 0; i < beneficiaires.length; i++) {
        if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
          beneficiaireToDeletePosition = i;
          break;
        }
      }
      beneficiaires.splice(beneficiaireToDeletePosition, 1);
      beneficiairesService.saveBeneficiaires(beneficiaires);

      var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
      var newBeneficiairesPresentByDistribution = [];
      var beneficiairePresentByDistributionToDeletePosition = -1;
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire.id) {
          newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
        }
      }
      beneficiairesService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);

      $scope.cancelBeneficiaireDetail();
    };

    $scope.openBeneficiaireList = function () {
      $location.path("/beneficiaires");
    }

    $scope.openBeneficiaireDetail();
  }

})();
