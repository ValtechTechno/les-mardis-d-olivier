(function () {
  'use strict';

  if (typeof localStorage === 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  angular
    .module('mardisDolivier')
    .service('dataService', dataService);

  function dataService($q, $rootScope, uuid) {
    var db = new PouchDB('lesmardis');
    var BENEFICIAIRE_PREFIX = 'benef_';
    var DISTRIBUTION_PREFIX = 'distri_';
    var BENEFICIAIRE_BY_DISTRIBUTION_PREFIX = 'bbd_';
    var ASSOCIATION_PREFIX = 'asso_';
    var ANTENNE_PREFIX = 'ante_';
    var service = {
      addOrUpdateBeneficiaire: addOrUpdateBeneficiaire,
      findAllBeneficiaires: findAllBeneficiaires,
      findBeneficiaireById: findBeneficiaireById,
      findAllBeneficiairesByAntenneId: findAllBeneficiairesByAntenneId,
      removeBeneficiaire: removeBeneficiaire,
      saveBeneficiaires: saveBeneficiaires,
      addOrUpdateBenevole: addOrUpdateBenevole,
      findAllBenevoles: findAllBenevoles,
      findAllBenevolesByAntenneId: findAllBenevolesByAntenneId,
      findBenevoleById: findBenevoleById,
      removeBenevole: removeBenevole,
      addOrUpdateDistribution: addOrUpdateDistribution,
      findAllDistributions: findAllDistributions,
      findAllDistributionsByAntenneId: findAllDistributionsByAntenneId,
      findDistributionById: findDistributionById,
      findDistributionByIds: findDistributionByIds,
      addOrUpdateBeneficiaireByDistribution: addOrUpdateBeneficiaireByDistribution,
      findAllBeneficiaireByDistribution: findAllBeneficiaireByDistribution,
      findBeneficiaireByDistributionByBeneficiaireId: findBeneficiaireByDistributionByBeneficiaireId,
      removeBeneficiaireByDistribution: removeBeneficiaireByDistribution,
      removeBeneficiaireByDistributionByBeneficiaire:removeBeneficiaireByDistributionByBeneficiaire,
      getAboutByAntenneId: getAboutByAntenneId,
      updateAbout: updateAbout,
      login: login,
      findAllAssociations: findAllAssociations,
      addOrUpdateAssociation: addOrUpdateAssociation,
      findAllAntennes: findAllAntennes,
      addOrUpdateAntenne: addOrUpdateAntenne,
      getAntenneByBenevoleId:getAntenneByBenevoleId
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

    function findAllBeneficiairesByAntenneId(antenneId){
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('benef') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: getAntenneIdForDatabase(antenneId),
        include_docs: true
      })
        .then(function (res) {
          console.log(res);
          $rootScope.$apply(function () {
            var objects = [];
            for (var i = 0; i < res.rows.length; i++) {
                res.rows[i].doc._id = getBeneficiaireIdForView(res.rows[i].doc._id);
                objects.push(res.rows[i].doc);
            }
            return deferred.resolve(objects);
          });
        })
        .catch(function (err) {
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
        type: 'benef',
        code: beneficiaire.code,
        firstName: beneficiaire.firstName,
        lastName: beneficiaire.lastName,
        hasCard: beneficiaire.hasCard,
        antenneId: getAntenneIdForDatabase(beneficiaire.antenneId)
      };
    }

    function addOrUpdateBenevole(benevole) {
      var deferred = $q.defer();
      var benev = getBenevole(benevole);
      console.log(benev);
      db.put(benev)
        .then(function (doc) {
          $rootScope.$apply(function () {
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

      function myMapFunction(doc) {
          emit(doc.type);
      }

      db.query(myMapFunction, {
        key: 'benev',
        include_docs: true
      })
      .then(function (res) {

        var benevoles = [];
        for (var i = 0; i < res.rows.length; i++) {
          res.rows[i].doc.antenneId = getAntenneIdForView(res.rows[i].doc.antenneId);
          res.rows[i].doc.associationId = getAssociationIdForView(res.rows[i].doc.associationId);
          benevoles.push(res.rows[i].doc);
        }
        deferred.resolve(benevoles);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function findAllBenevolesByAntenneId(antenneId){
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('benev') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: getAntenneIdForDatabase(antenneId),
        include_docs: true
      })
        .then(function (res) {
          console.log(res);
          $rootScope.$apply(function () {
            var objects = [];
            for (var i = 0; i < res.rows.length; i++) {
                objects.push(res.rows[i].doc);
            }
            return deferred.resolve(objects);
          });
        })
        .catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findBenevoleById(benevoleId) {
      var deferred = $q.defer();
      db.get(benevoleId)
        .then(function (doc) {
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
      db.remove(benevole).then(function (response) {
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function getBenevole(benevole) {
      if (benevole._rev === undefined) {
        return {
          _id: uuid.v4(),
          firstName: benevole.firstName,
          lastName: benevole.lastName,
          email: benevole.email,
          phoneNumber: benevole.phoneNumber,
          isAdmin: benevole.isAdmin,
          password: benevole.password,
          englishLevel: benevole.englishLevel,
          spanishLevel: benevole.spanishLevel,
          germanLevel: benevole.germanLevel,
          antenneId: getAntenneIdForDatabase(benevole.antenneId),
          associationId: getAssociationIdForDatabase(benevole.associationId),
          type: 'benev'
        };
      }
      return benevole;
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

    function findAllDistributionsByAntenneId(antenneId) {
      var deferred = $q.defer();

      function map(doc) {
        if (doc.type !== undefined && doc.type.indexOf('distri') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(map, {key: getAntenneIdForDatabase(antenneId), include_docs: true}).then(function (res) {
        console.log(res);
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
      distribution.type = 'distri';
      distribution.antenneId = getAntenneIdForDatabase(distribution.antenneId);
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


    function getAboutByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('about') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: getAntenneIdForDatabase(antenneId),
        include_docs: true
      })
        .then(function (doc) {
          $rootScope.$apply(function () {
            return deferred.resolve(doc.rows);
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
        about._id = uuid.v4();
        about.antenneId = getAntenneIdForDatabase(about.antenneId);
        about.type = 'about';
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
            if(res.rows.length !== 0) {
              res.rows[0].doc.antenneId = getAntenneIdForView(res.rows[0].doc.antenneId);
              res.rows[0].doc.associationId = getAssociationIdForView(res.rows[0].doc.associationId);
            }
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
      association.type = 'asso';
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
      antenne.type = 'ante';
      antenne.associationId = getAssociationIdForDatabase(antenne.associationId);
      return antenne;
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
