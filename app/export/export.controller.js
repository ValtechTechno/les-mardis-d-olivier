(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController($scope, $filter, dataService) {
    $scope.openExportPage = function () {
      dataService.findAllBeneficiaires()
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
        });
      dataService.findAllDistributions().then(function (distributions) {
        $scope.distributions = distributions;
      });
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
        });
      dataService.findAllBenevoles()
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
        });
      dataService.findAllBeneficiaireByDistribution().then(function (bbds) {
        $scope.beneficiairesPresentByDistribution = bbds;
      });
      dataService.getAbout().then(function (about) {
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
