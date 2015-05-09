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
    var DISTRIBUTION_PREFIX = 'distri_';
    var ABOUT_ID = 'about_information';
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
      deleteBeneficiaire:deleteBeneficiaire,
      addOrUpdateDistribution:addOrUpdateDistribution
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

    function findDistributionById(distributionId) {
      var deferred = $q.defer();
      db.get(getDistributionIdForDatabase(distributionId))
        .then(function (doc) {
          doc._id = getDistributionIdForView(doc._id);
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function loadBeneficiaires() {
      var deferred = $q.defer();

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
      var deferred = $q.defer();
      beneficiaire._id = getBeneficiaireIdForDatabase(beneficiaire._id);
      db.remove(beneficiaire).then(function (response) {
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function saveDistributions(distributions) {
      localStorage.setItem('distributions', angular.toJson(distributions));
    }

    function allDistributions() {
      var deferred = $q.defer();

      db.allDocs({startkey: DISTRIBUTION_PREFIX, endkey: DISTRIBUTION_PREFIX+'\uffff', include_docs: true}).then(function (res) {

        var distributions = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getDistributionIdForView(res.rows[i].doc._id);
          distributions.push(res.rows[i].doc);
        }
        deferred.resolve(distributions);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }


    function addOrUpdateDistribution(distribution) {
      var deferred = $q.defer();
      var distri = getDistribution(distribution);
      db.put(distri)
        .then(function (doc) {
          $rootScope.$apply(function () {
            distri._id = getDistributionIdForView(distri._id);
            distri._rev = doc._rev;
            return deferred.resolve(distri);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getDistributionIdForView(id){
      return id.replace(DISTRIBUTION_PREFIX, '');
    }

    function getDistributionIdForDatabase(id){
      return DISTRIBUTION_PREFIX+id;
    }

    function getDistribution(distribution) {
        distribution._id = getDistributionIdForDatabase(distribution._id);
        return distribution;
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
      var deferred = $q.defer();
      db.get(ABOUT_ID)
        .then(function (doc) {
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(null);
        });
      return deferred.promise;
    }

    function saveAbout(about) {
      var deferred = $q.defer();
      if(about._rev === undefined) {
        about._id = ABOUT_ID;
      }
      db.put(about)
        .then(function (doc) {
          $rootScope.$apply(function () {
            about._rev = doc._rev;
            return deferred.resolve(about);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();
