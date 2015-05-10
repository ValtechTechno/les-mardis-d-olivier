(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController($scope, $filter, dataService) {
    $scope.openExportPage = function () {
      dataService.loadBeneficiaires()
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
        });
      dataService.allDistributions().then(function (distributions) {
        $scope.distributions = distributions;
      });
      dataService.allBeneficiaireByDistribution().then(function (bbds) {
        $scope.beneficiairesPresentByDistribution = bbds;
      });
      dataService.about().then(function (about) {
        $scope.about = about;
      });
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
