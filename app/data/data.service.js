(function () {
  'use strict';

  if (typeof localStorage === 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  angular
    .module('mardisDolivier')
    .service('dataService', dataService);

  function dataService($q, $rootScope) {
    var db = new PouchDB('lesmardis');
    var BENEFICIAIRE_PREFIX = 'benef_';
    var BENEVOLE_PREFIX = 'benev_';
    var DISTRIBUTION_PREFIX = 'distri_';
    var BENEFICIAIRE_BY_DISTRIBUTION_PREFIX = 'bbd_';
    var ABOUT_ID = 'about_information';
    var ASSOCIATION_PREFIX = 'asso_';
    var ANTENNE_PREFIX = 'ante_';
    var BENEVOLE_ANTENNE_PREFIX = 'ba_';
    var service = {
      addOrUpdateBeneficiaire: addOrUpdateBeneficiaire,
      findAllBeneficiaires: findAllBeneficiaires,
      findBeneficiaireById: findBeneficiaireById,
      removeBeneficiaire: removeBeneficiaire,
      saveBeneficiaires: saveBeneficiaires,
      addOrUpdateBenevole: addOrUpdateBenevole,
      findAllBenevoles: findAllBenevoles,
      findBenevoleById: findBenevoleById,
      removeBenevole: removeBenevole,
      addOrUpdateDistribution: addOrUpdateDistribution,
      findAllDistributions: findAllDistributions,
      findDistributionById: findDistributionById,
      findDistributionByIds: findDistributionByIds,
      addOrUpdateBeneficiaireByDistribution: addOrUpdateBeneficiaireByDistribution,
      findAllBeneficiaireByDistribution: findAllBeneficiaireByDistribution,
      findBeneficiaireByDistributionByBeneficiaireId: findBeneficiaireByDistributionByBeneficiaireId,
      removeBeneficiaireByDistribution: removeBeneficiaireByDistribution,
      removeBeneficiaireByDistributionByBeneficiaire:removeBeneficiaireByDistributionByBeneficiaire,
      getAbout: getAbout,
      updateAbout: updateAbout,
      login: login,
      findAllAssociations: findAllAssociations,
      addOrUpdateAssociation: addOrUpdateAssociation,
      findAllAntennes: findAllAntennes,
      addOrUpdateAntenne: addOrUpdateAntenne,
      findAllBenevoleAntenne: findAllBenevoleAntenne,
      addOrUpdateBenevoleAntenne: addOrUpdateBenevoleAntenne,
      getAntenneByBenevoleId: getAntenneByBenevoleId
    };

    return service;

    function addOrUpdateBeneficiaire(beneficiaire) {
      var deferred = $q.defer();
      var benef = getBeneficiaire(beneficiaire);
      console.log(benef);
      db.put(benef)
        .then(function (doc) {
          $rootScope.$apply(function () {
            benef._id = getBeneficiaireIdForView(benef._id);
            benef._rev = doc.rev;
            return deferred.resolve(benef);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function removeBeneficiaire(beneficiaire) {
      var deferred = $q.defer();
      beneficiaire._id = getBeneficiaireIdForDatabase(beneficiaire._id);
      db.remove(beneficiaire).then(function (response) {
        beneficiaire._id = getBeneficiaireIdForView(beneficiaire._id);
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function findAllBeneficiaires() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: BENEFICIAIRE_PREFIX,
        endkey: BENEFICIAIRE_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

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
          console.log(doc);
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function saveBeneficiaires(beneficiaires) {
      var deferred = $q.defer();
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
      }
      db.bulkDocs(beneficiairesToCreate).then(function (response) {
        console.log(response);
        return deferred.resolve();
      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getBeneficiaireIdForView(id) {
      return id.replace(BENEFICIAIRE_PREFIX, '');
    }

    function getBeneficiaireIdForDatabase(id) {
      return BENEFICIAIRE_PREFIX + id;
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

    function addOrUpdateBenevole(benevole) {
      var deferred = $q.defer();
      var benev = getBenevole(benevole);
      console.log(benev);
      db.put(benev)
        .then(function (doc) {
          $rootScope.$apply(function () {
            benev._id = getBenevoleIdForView(benev._id);
            benev._rev = doc.rev;
            return deferred.resolve(benev);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findAllBenevoles() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: BENEVOLE_PREFIX,
        endkey: BENEVOLE_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

        var benevoles = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getBenevoleIdForView(res.rows[i].doc._id);
          benevoles.push(res.rows[i].doc);
        }
        deferred.resolve(benevoles);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function findBenevoleById(benevoleId) {
      var deferred = $q.defer();
      db.get(getBenevoleIdForDatabase(benevoleId))
        .then(function (doc) {
          doc._id = getBenevoleIdForView(doc._id);
          console.log(doc);
          $rootScope.$apply(function () {
            return deferred.resolve(doc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function removeBenevole(benevole) {
      var deferred = $q.defer();
      benevole._id = getBenevoleIdForDatabase(benevole._id);
      db.remove(benevole).then(function (response) {
        benevole._id = getBenevoleIdForView(benevole._id);
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function getBenevoleIdForView(id) {
      return id.replace(BENEVOLE_PREFIX, '');
    }

    function getBenevoleIdForDatabase(id) {
      return BENEVOLE_PREFIX + id;
    }

    function getBenevole(benevole) {
      if (benevole._rev !== undefined) {
        benevole._id = getBenevoleIdForDatabase(benevole._id);
        return benevole;
      }
      return {
        _id: getBenevoleIdForDatabase(benevole._id),
        firstName: benevole.firstName,
        lastName: benevole.lastName,
        email: benevole.email,
        phoneNumber: benevole.phoneNumber,
        isAdmin : benevole.isAdmin,
        password: benevole.password,
        englishLevel:benevole.englishLevel,
        spanishLevel:benevole.spanishLevel,
        germanLevel:benevole.germanLevel
      };
    }

    function findAllDistributions() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: DISTRIBUTION_PREFIX,
        endkey: DISTRIBUTION_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

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
            distri._rev = doc.rev;
            return deferred.resolve(distri);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
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

    function findDistributionByIds(distributionIds) {
      for(var i=0;i<distributionIds.length;i++){
        distributionIds[i] = getDistributionIdForDatabase(distributionIds[i]);
      }
      var deferred = $q.defer();
      db.allDocs({
        include_docs: true,
        keys:distributionIds})
        .then(function (docs) {
          var distributions = [];
          for(var i=0;i<docs.rows.length;i++){
            docs.rows[i].doc._id = getDistributionIdForView(docs.rows[i].doc._id);
            distributions.push(docs.rows[i].doc);
          }
          $rootScope.$apply(function () {
            return deferred.resolve(distributions);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getDistributionIdForView(id) {
      return id.replace(DISTRIBUTION_PREFIX, '');
    }

    function getDistributionIdForDatabase(id) {
      return DISTRIBUTION_PREFIX + id;
    }

    function getDistribution(distribution) {
      distribution._id = getDistributionIdForDatabase(distribution._id);
      return distribution;
    }

    function addOrUpdateBeneficiaireByDistribution(bbd) {
      var deferred = $q.defer();
      if (bbd._id === undefined) {
        bbd._id = BENEFICIAIRE_BY_DISTRIBUTION_PREFIX + bbd.distributionId + "_" + bbd.beneficiaireId;
      }
      console.log(bbd);
      db.put(bbd)
        .then(function (doc) {
          console.log(doc);
          $rootScope.$apply(function () {
            bbd._rev = doc.rev;
            return deferred.resolve(bbd);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findAllBeneficiaireByDistribution() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: BENEFICIAIRE_BY_DISTRIBUTION_PREFIX,
        endkey: BENEFICIAIRE_BY_DISTRIBUTION_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

        var beneficiaireByDistribution = [];
        for (var i = 0; i < res.rows.length; i++) {
          beneficiaireByDistribution.push(res.rows[i].doc);
        }
        deferred.resolve(beneficiaireByDistribution);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function findBeneficiaireByDistributionByBeneficiaireId(beneficiaireId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        emit(doc.beneficiaireId);
      }

      db.query(myMapFunction, {
        key: beneficiaireId, include_docs: true
      })
        .then(function (res) {

          var bdd = [];
          for (var i = 0; i < res.rows.length; i++) {
            bdd.push(res.rows[i].doc);
          }
          deferred.resolve(bdd);

        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function removeBeneficiaireByDistribution(bbd) {
      var deferred = $q.defer();
      db.remove(bbd).then(function (response) {
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function removeBeneficiaireByDistributionByBeneficiaire(bbdsToDelete) {
      var deferred = $q.defer();
      for(var i=0; i<bbdsToDelete.length;i++) {
        bbdsToDelete[i]._deleted = true;
      }
      db.bulkDocs(bbdsToDelete).then(function (response) {
        console.log(response);
        return deferred.resolve();
      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }


    function getAbout() {
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

    function updateAbout(about) {
      var deferred = $q.defer();
      if (about._rev === undefined) {
        about._id = ABOUT_ID;
      }
      db.put(about)
        .then(function () {
            return deferred.resolve();
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function login(email) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        emit(doc.email);
      }

      db.query(myMapFunction, {
        key: email,
        include_docs: true
      })
      .then(function (res) {
          console.log(res);
          $rootScope.$apply(function () {
            res.rows[0].doc._id = getBenevoleIdForView(res.rows[0].doc._id);
            return deferred.resolve(res);
          });
        })
        .catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function addOrUpdateAssociation(association) {
      var deferred = $q.defer();
      var assoc = getAssociation(association);
      console.log(assoc);
      db.put(assoc)
        .then(function (doc) {
          $rootScope.$apply(function () {
            assoc._id = getAssociationIdForView(assoc._id);
            assoc._rev = doc.rev;
            return deferred.resolve(assoc);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findAllAssociations() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: ASSOCIATION_PREFIX,
        endkey: ASSOCIATION_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

        var associations = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getAssociationIdForView(res.rows[i].doc._id);
          associations.push(res.rows[i].doc);
        }
        deferred.resolve(associations);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAssociationIdForView(id) {
      return id.replace(ASSOCIATION_PREFIX, '');
    }

    function getAssociationIdForDatabase(id) {
      return ASSOCIATION_PREFIX + id;
    }

    function getAssociation(association) {
      association._id = getAssociationIdForDatabase(association._id);
      return association;
    }

    function addOrUpdateAntenne(antenne) {
      var deferred = $q.defer();
      var ante = getAntenne(antenne);
      console.log(ante);
      db.put(ante)
        .then(function (doc) {
          $rootScope.$apply(function () {
            ante._id = getAntenneIdForView(ante._id);
            ante.associationId = getAssociationIdForView(ante.associationId);
            ante._rev = doc.rev;
            return deferred.resolve(ante);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findAllAntennes() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: ANTENNE_PREFIX,
        endkey: ANTENNE_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

        var antennes = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getAntenneIdForView(res.rows[i].doc._id);
          res.rows[i].doc.associationId = getAssociationIdForView(res.rows[i].doc.associationId);
          antennes.push(res.rows[i].doc);
        }
        deferred.resolve(antennes);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAntenneIdForView(id) {
      return id.replace(ANTENNE_PREFIX, '');
    }

    function getAntenneIdForDatabase(id) {
      return ANTENNE_PREFIX + id;
    }

    function getAntenne(antenne) {
      antenne._id = getAntenneIdForDatabase(antenne._id);
      antenne.associationId = getAssociationIdForDatabase(antenne.associationId);
      return antenne;
    }

    function findAllBenevoleAntenne() {
      var deferred = $q.defer();

      db.allDocs({
        startkey: BENEVOLE_ANTENNE_PREFIX,
        endkey: BENEVOLE_ANTENNE_PREFIX + '\uffff',
        include_docs: true
      }).then(function (res) {

        var antennes = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc._id = getBenevoleAntenneIdForView(res.rows[i].doc._id);
          res.rows[i].doc.benevoleId = getBenevoleIdForView(res.rows[i].doc.benevoleId);
          res.rows[i].doc.antenneId = getAntenneIdForView(res.rows[i].doc.antenneId);
          antennes.push(res.rows[i].doc);
        }
        deferred.resolve(antennes);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function addOrUpdateBenevoleAntenne(beneAnteId, benevoleId, antenneId) {
      var deferred = $q.defer();
      var beneAnte = getBenevoleAntenne(beneAnteId, benevoleId, antenneId);
      console.log(beneAnte);
      db.put(beneAnte)
        .then(function () {
          $rootScope.$apply(function () {
            return deferred.resolve();
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getBenevoleAntenneIdForView(id) {
      return id.replace(BENEVOLE_ANTENNE_PREFIX, '');
    }

    function getBenevoleAntenneIdForDatabase(id) {
      return BENEVOLE_ANTENNE_PREFIX + id;
    }

    function getBenevoleAntenne(beneAnteId, benevoleId, antenneId) {
      var beneAnte = {};
      beneAnte._id = getBenevoleAntenneIdForDatabase(beneAnteId);
      beneAnte.benevoleId = getBenevoleIdForDatabase(benevoleId);
      beneAnte.antenneId = getAntenneIdForDatabase(antenneId);
      return beneAnte;
    }

    function getAntenneByBenevoleId(benevoleId){
      var deferred = $q.defer();

      function myMapFunction(doc) {
        emit(doc.benevoleId);
      }

      db.query(myMapFunction, {
        key: benevoleId,
        include_docs: true
      })
        .then(function (res) {
          console.log(res);
          $rootScope.$apply(function () {
            var antennes = [];
            for(var baIndex = 0;baIndex<res.rows.length;baIndex++){
              antennes.push(getAntenneIdForView(res.rows[baIndex].doc._id));
            }
            return deferred.resolve(antennes);
          });
        })
        .catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();
