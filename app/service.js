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
      loadBeneficiaires : loadBeneficiaires
    };

    return service;

    function loadBeneficiaires() {
      var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
      if (beneficiaires === null) {
        beneficiaires = [];
      }
      return beneficiaires;
    };
  }
})();
