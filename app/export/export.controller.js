(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ExportController', ExportController);

  function ExportController($scope, dataService, $rootScope) {
    $scope.openExportPage = function () {

      $scope.spinnerBenef = {active : true};
      dataService.findAllBeneficiairesByAntenneId($rootScope.account.antenneId)
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
          $scope.spinnerBenef = {active : false};
        });

      dataService.findAllDistributionsByAntenneId($rootScope.account.antenneId).then(function (distributions) {
        $scope.distributions = distributions;
      });

      $scope.spinnerAsso = {active : true};
      dataService.findAllAssociations()
        .then(function (associations) {
          $scope.associations = associations;
          $scope.spinnerAsso = {active : false};
        });

      $scope.spinnerAnte = {active : true};
      dataService.findAllAntennes()
        .then(function (antennes) {
          $scope.antennes = antennes;
          $scope.spinnerAnte = {active : false};
        });

      $scope.spinnerBenev = {active : true};
      dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.spinnerBenev = {active : false};
        });
      dataService.findAllFamiliesByAntenneId($rootScope.account.antenneId)
        .then(function (families) {
          $scope.families = families;
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
