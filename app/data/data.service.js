(function(){
  'use strict';

  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  angular
      .module('mardisDolivier')
      .service('dataService', dataService);

  function dataService($q, $rootScope) {
    var db = new PouchDB('lesmardis');
    var BENEFICIAIRE_TYPE = 'benef';
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
      saveAbout: saveAbout,
      addOrUpdateBeneficiaire: addOrUpdateBeneficiaire,
      deleteBeneficiaire:deleteBeneficiaire
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

    function findDistributionById(distributionId, _distributions) {
      var distributions = _distributions !== undefined ? _distributions : allDistributions();
      for (var i = 0; i < distributions.length; i++) {
        if(distributions[i]._id == distributionId){
          return distributions[i];
        }
      }
      return distributions;
    }

    // TODO validate the db.changes instead of db.query, fix for sorting purpose
    function loadBeneficiaires() {
      var deferred = $q.defer();
      db.changes({
        filter: function (doc) {
          return doc.type === BENEFICIAIRE_TYPE;
        }, include_docs: true
      }, function (err, res) {
        $rootScope.$apply(function () {
          if (err) {
            deferred.reject(err);
          } else {
            var beneficiaires = [];
            for (var i = 0; i < res.results.length; i++) {
              beneficiaires.push(res.results[i].doc);
            }
            deferred.resolve(beneficiaires);
          }
        });
      });
      return deferred.promise;
    }

    function findBeneficiaireById(beneficiaireId) {
      var deferred = $q.defer();
      db.get(beneficiaireId)
        .then(function (doc) {
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function addOrUpdateBeneficiaire(beneficiaire) {
      var deferred = $q.defer();
      var benef = getBeneficiaire(beneficiaire);
      db.put(benef)
        .then(function (doc) {
          $rootScope.$apply(function () {
            benef._rev = doc._rev;
            return deferred.resolve(benef);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getBeneficiaire(beneficiaire) {
      if (beneficiaire._rev !== undefined) {
        return beneficiaire;
      }
      return {
        _id: beneficiaire._id,
        type: BENEFICIAIRE_TYPE,
        code: beneficiaire.code,
        firstName: beneficiaire.firstName,
        lastName: beneficiaire.lastName,
        hasCard: beneficiaire.hasCard
      };
    }

    // TODO use db.bulkDocs([...,...]
    function saveBeneficiaires(beneficiaires) {
      var beneficiairesLength = beneficiaires === null ? 0 : beneficiaires.length;
      for (var i = 0; i < beneficiairesLength; i++) {
        var beneficiaire = beneficiaires[i];
        db.put({
          _id: beneficiaire._id,
          type: BENEFICIAIRE_TYPE,
          code: beneficiaire.code,
          firstName: beneficiaire.firstName,
          lastName: beneficiaire.lastName,
          hasCard: beneficiaire.hasCard
        }).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      }
    }

    function deleteBeneficiaire(beneficiaire) {
      db.remove(beneficiaire);
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
