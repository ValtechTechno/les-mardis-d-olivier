(function(){
  'use strict';

  angular
      .module('mardisDolivier')
      .service('dataService', dataService);

  function dataService($q) {
    var db = new PouchDB('lesmardis');
    var service = {
      clear: clear, // @VisibleForTesting
      loadBeneficiaires: loadBeneficiaires,
      findBeneficiaireById: findBeneficiaireById,
      saveBeneficiaires: saveBeneficiaires,
      allDistributions: allDistributions,
      saveDistributions: saveDistributions,
      allBeneficiairesPresentByDistribution: allBeneficiairesPresentByDistribution,
      saveBeneficiairesPresentByDistribution: saveBeneficiairesPresentByDistribution,
      findDistributionById: findDistributionById,
      updateDistribution: updateDistribution,
      about: about,
      saveAbout: saveAbout
    };

    return service;

    function clear() {
      localStorage.clear();
    }

    function updateDistribution(distribution) {
      var distributions = allDistributions();
      for (var i = 0; i < distributions.length; i++) {
        if(distributions[i]._id == distribution._id){
          distributions[i] = distribution;
          break;
        }
      }
      saveDistributions(distributions);
    }

    function loadBeneficiaires() {
      return db.query('type', {
        key: 'beneficiaire',
        include_docs: true
      }).catch(function (error) {
        var defered = $q.defer();
        defered.resolve([]);
        return defered.promise;
      });
    }

    function findDistributionById(distributionId, _distributions) {
      var distributions = _distributions !== undefined ? _distributions : allDistributions();
      for (var i = 0; i < distributions.length; i++) {
        if(distributions[i]._id == distributionId){
          return distributions[i];
        }
      }
      return distributions;
    }

    function findBeneficiaireById(beneficiaireId, _beneficiaires) {
      var beneficiaires = _beneficiaires !== undefined ? _beneficiaires : loadBeneficiaires();
      for (var i = 0; i < beneficiaires.length; i++) {
        if(beneficiaires[i]._id == beneficiaireId){
          return beneficiaires[i];
        }
      }
      return beneficiaires;
    }

    function saveBeneficiaires(beneficiairesPromise) {
      var cleanBeneficiairesList = [];
      beneficiairesPromise.then(function(beneficiaires){
        var  beneficiairesLength = results === null ? 0 : results.length;
        for (var i = 0; i < beneficiairesLength ; i++) {
          var beneficiaire = beneficiaires[i];
          db.put({
            _id: beneficiaire._id,
            type: 'beneficiaire',
            code: beneficiaire.code,
            firstName: beneficiaire.firstName,
            lastName: beneficiaire.lastName,
            description: beneficiaire.description,
            excluded: beneficiaire.excluded,
            hasCard: beneficiaire.hasCard
          });
        }
      });
    }

    function allDistributions() {
      var distributions = angular.fromJson(localStorage.getItem('distributions'));
      if (distributions === null) {
        distributions = [];
      }
      return distributions;
    }

    function saveDistributions(distributions) {
      localStorage.setItem('distributions', angular.toJson(distributions));
    }

    function allBeneficiairesPresentByDistribution() {
      var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
      if (beneficiairesPresentByDistribution === null) {
        beneficiairesPresentByDistribution = [];
      }
      return beneficiairesPresentByDistribution;
    }

    function saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution) {
      localStorage.setItem('beneficiairesPresentByDistribution', angular.toJson(newBeneficiairesPresentByDistribution));
    }

    function about() {
      return angular.fromJson(localStorage.getItem('aboutInformation'));
    }

    function saveAbout(about) {
      localStorage.setItem('aboutInformation', angular.toJson(about));
    }

  }
})();
