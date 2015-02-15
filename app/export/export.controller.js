(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController ($scope, $filter, beneficiairesService) {
    $scope.openExportPage = function () {
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.distributions = beneficiairesService.allDistributions();
      $scope.beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
      $scope.about = angular.fromJson(localStorage.getItem('aboutInformation'));
    };

    $scope.exportData = function () {
      var blobToExport = new Blob([document.getElementById('toExport').innerHTML], {
        type: "data:application/csv;charset=UTF-8"
      });
      saveAs(blobToExport, formatDate(new Date())+ "_beneficiaire.xls");
    };

    $scope.isBooleanUndefined = function (value) {
      if(value == undefined){
        return false;
      }
      return value;
    };
    $scope.openExportPage();
  }


})();
