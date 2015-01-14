(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', function ($scope, $filter, beneficiairesService, commonService) {

    commonService.init($scope, beneficiairesService);

    $scope.openBeneficiaireList = function () {
      commonService.resetAddBeneficiareForm($scope);
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = {code: commonService.initNextCode($scope)};
      $scope.currentPage = {beneficiaireList: true};
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope, beneficiaire);
    };

    $scope.addBeneficiaireFromList = function () {
      if (commonService.addBeneficiaire($scope)) {
        commonService.resetAddBeneficiareForm($scope);
        $scope.currentBeneficiaire = {code: commonService.initNextCode($scope)};
      }
    };

    $scope.openBeneficiaireDetail = function (beneficiaire, fromDistribution) {
      commonService.openBeneficiaireDetail($scope, beneficiaire, fromDistribution)
    };

    // UPDATE BENEF

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

    $scope.aboutPageConfirmPopupCancel = function () {
      $('#confirmDeletePopup').foundation('reveal', 'close');
    }

    $scope.aboutPageConfirmPopupSave = function () {
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

    $scope.openBeneficiaireList();
  })

})();
