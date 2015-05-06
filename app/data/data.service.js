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
    var BENEFICIAIRE_PREFIX = 'benef_';
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

    function loadBeneficiaires() {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        emit(doc.type);
      }

      db.allDocs({startkey: BENEFICIAIRE_PREFIX, endkey: BENEFICIAIRE_PREFIX+'\uffff', include_docs: true}).then(function (res) {
        var beneficiaires = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getBeneficiaireIdForView(res.rows[i].doc._id);
          beneficiaires.push(res.rows[i].doc);
        }
        deferred.resolve(beneficiaires);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function findBeneficiaireById(beneficiaireId) {
      var deferred = $q.defer();
      db.get(getBeneficiaireIdForDatabase(beneficiaireId))
        .then(function (doc) {
          doc._id = getBeneficiaireIdForView(doc._id);
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getBeneficiaireIdForView(id){
      return id.replace(BENEFICIAIRE_PREFIX, '');
    }

    function getBeneficiaireIdForDatabase(id){
      return BENEFICIAIRE_PREFIX+id;
    }

    function addOrUpdateBeneficiaire(beneficiaire) {
      var deferred = $q.defer();
      var benef = getBeneficiaire(beneficiaire);
      db.put(benef)
        .then(function (doc) {
          $rootScope.$apply(function () {
            benef._id = getBeneficiaireIdForView(benef._id);
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
        beneficiaire._id = getBeneficiaireIdForDatabase(beneficiaire._id);
        return beneficiaire;
      }
      return {
        _id: getBeneficiaireIdForDatabase(beneficiaire._id),
        code: beneficiaire.code,
        firstName: beneficiaire.firstName,
        lastName: beneficiaire.lastName,
        hasCard: beneficiaire.hasCard
      };
    }

    function saveBeneficiaires(beneficiaires) {
      var beneficiairesToCreate = [];
      var beneficiairesLength = beneficiaires === null ? 0 : beneficiaires.length;
      for (var i = 0; i < beneficiairesLength; i++) {
        var beneficiaire = beneficiaires[i];
        beneficiairesToCreate.push({
          _id: getBeneficiaireIdForDatabase(beneficiaire._id),
          code: beneficiaire.code,
          firstName: beneficiaire.firstName,
          lastName: beneficiaire.lastName,
          hasCard: beneficiaire.hasCard
        });
        db.bulkDocs(beneficiairesToCreate).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      }
    }

    function deleteBeneficiaire(beneficiaire) {
      beneficiaire._id = getBeneficiaireIdForDatabase(beneficiaire._id);
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
