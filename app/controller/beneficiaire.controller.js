(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', BeneficiaireController);

  function BeneficiaireController ($scope, beneficiairesService, commonService, $location) {

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

    $scope.openBeneficiaireDetail = function(beneficiaire, fromDistribution) {
      $location.path("/beneficiaireDetail/"+beneficiaire.id);
    }

    $scope.openBeneficiaireList();
  }

})();
