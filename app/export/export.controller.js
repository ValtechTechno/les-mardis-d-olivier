(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController($scope, dataService, $rootScope) {
    $scope.openExportPage = function () {
      dataService.findAllBeneficiairesByAntenneId($rootScope.account.antenneId)
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
        });
      dataService.findAllDistributionsByAntenneId($rootScope.account.antenneId).then(function (distributions) {
        $scope.distributions = distributions;
      });
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
        });
      dataService.findAllAntennes()
        .then(function (antennes) {
          $scope.antennes = antennes;
        });
      dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
        });
      dataService.findAllBeneficiaireByDistributionByAntenneId($rootScope.account.antenneId).then(function (bbds) {
        $scope.beneficiairesPresentByDistribution = bbds;
      });
      dataService.getAboutByAntenneId($rootScope.account.antenneId).then(function (about) {
        if(about.length === 1) {
          $scope.about = about[0].doc;
        }
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
