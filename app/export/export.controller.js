(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController ($scope, $filter, dataService) {
    $scope.openExportPage = function () {
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.distributions = dataService.allDistributions();
      $scope.beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
      $scope.about = dataService.about();
    };

    $scope.exportData = function () {
      var blobToExport = new Blob([document.getElementById('toExport').innerHTML], {
        type: "data:application/csv;charset=UTF-8"
      });
      saveAs(blobToExport, formatDate(new Date())+ "_beneficiaire.xls");
    };

    $scope.isBooleanUndefined = function (value) {
      if(value === undefined){
        return false;
      }
      return value;
    };
    $scope.openExportPage();
  }


})();
