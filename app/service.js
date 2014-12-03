(function() {
  'use strict';

  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  angular
    .module('mardisDolivier')
    .service('beneficiairesService', beneficiairesService);

  function beneficiairesService() {
    var service = {
      loadBeneficiaires : loadBeneficiaires,
      allDistributions : allDistributions,
      saveDistributions : saveDistributions
    };

    return service;

    function loadBeneficiaires() {
      var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
      if (beneficiaires === null) {
        beneficiaires = [];
      }
      return beneficiaires;
    };
    
    function allDistributions() {
      return angular.fromJson(localStorage.getItem('distributions'));
    };
    
    function saveDistributions(distributions) {
      localStorage.setItem('distributions', angular.toJson(distributions));
    };
  }
})();
