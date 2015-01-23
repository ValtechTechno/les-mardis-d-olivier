(function () {
  'use strict';

  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  angular
      .module('mardisDolivier')
      .service('beneficiairesService', beneficiairesService);

  function beneficiairesService() {
    var service = {
      loadBeneficiaires: loadBeneficiaires,
      findBeneficiaireById: findBeneficiaireById,
      saveBeneficiaires: saveBeneficiaires,
      allDistributions: allDistributions,
      saveDistributions: saveDistributions,
      beneficiairesPresentByDistribution: beneficiairesPresentByDistribution,
      saveBeneficiairesPresentByDistribution: saveBeneficiairesPresentByDistribution,
      findDistributionById: findDistributionById
    };

    return service;

    function loadBeneficiaires() {
      var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
      if (beneficiaires === null) {
        beneficiaires = [];
      }
      return beneficiaires;
    }

    function findDistributionById(distributionId, _distributions) {
      var distributions = _distributions != null ? _distributions : allDistributions();
      for (var i = 0; i < distributions.length; i++) {
        if(distributions[i].id == distributionId){
          return distributions[i];
        }
      }
      return distributions;
    }

    function findBeneficiaireById(beneficiaireId, _beneficiaires) {
      var beneficiaires = _beneficiaires != null ? _beneficiaires : loadBeneficiaires();
      for (var i = 0; i < beneficiaires.length; i++) {
        if(beneficiaires[i].id == beneficiaireId){
          return beneficiaires[i];
        }
      }
      return beneficiaires;
    }

    function saveBeneficiaires(beneficiaires) {
      localStorage.setItem('beneficiaires', angular.toJson(beneficiaires));
    }

    function allDistributions() {
      return angular.fromJson(localStorage.getItem('distributions'));
    }

    function saveDistributions(distributions) {
      localStorage.setItem('distributions', angular.toJson(distributions));
    }

    function beneficiairesPresentByDistribution() {
      var beneficiairesPresentByDistribution = angular.fromJson(localStorage
        .getItem('beneficiairesPresentByDistribution'))
      if (beneficiairesPresentByDistribution == null) {
        beneficiairesPresentByDistribution = [];
      }
      return beneficiairesPresentByDistribution;
    }

    function saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution) {
      localStorage.setItem('beneficiairesPresentByDistribution', angular.toJson(newBeneficiairesPresentByDistribution));
    }
  }
})();
