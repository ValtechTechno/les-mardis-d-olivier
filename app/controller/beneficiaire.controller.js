(function () {
  'use strict';

  mardisDolivier.controller('BeneficiaireController', function ($scope, $filter, beneficiairesService, beneficiairesCommonService) {

    beneficiairesCommonService.init($scope, beneficiairesService);

    $scope.openBeneficiaireList = function () {
      beneficiairesCommonService.resetAddBeneficiareForm($scope);
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = {code: beneficiairesCommonService.initNextCode($scope)};
      $scope.currentPage = {beneficiaireList: true};
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return beneficiairesCommonService.searchBeneficiaire($scope, beneficiaire);
    };

    $scope.addBeneficiaireFromList = function () {
      if (beneficiairesCommonService.addBeneficiaire($scope)) {
        beneficiairesCommonService.resetAddBeneficiareForm($scope);
        $scope.currentBeneficiaire = {code: beneficiairesCommonService.initNextCode($scope)};
      }
    };

    $scope.openBeneficiaireDetail = function (beneficiaire, fromDistribution) {
      beneficiairesCommonService.openBeneficiaireDetail($scope, beneficiaire, fromDistribution)
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
      if (beneficiairesCommonService.userFormValidation($scope, true)) {
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
