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
    var service = {
      addOrUpdateBeneficiaire: addOrUpdateBeneficiaire,
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
      findAllDistributionsByAntenneId: findAllDistributionsByAntenneId,
      findDistributionById: findDistributionById,
      findDistributionByIds: findDistributionByIds,
      addOrUpdateBeneficiaireByDistribution: addOrUpdateBeneficiaireByDistribution,
      findAllBeneficiaireByDistributionByAntenneId: findAllBeneficiaireByDistributionByAntenneId,
      findBeneficiaireByDistributionByBeneficiaireId: findBeneficiaireByDistributionByBeneficiaireId,
      removeBeneficiaireByDistribution: removeBeneficiaireByDistribution,
      removeBeneficiaireByDistributionByBeneficiaire: removeBeneficiaireByDistributionByBeneficiaire,
      getAboutByAntenneId: getAboutByAntenneId,
      updateAbout: updateAbout,
      login: login,
      findAllAssociations: findAllAssociations,
      addOrUpdateAssociation: addOrUpdateAssociation,
      findAllAntennes: findAllAntennes,
      addOrUpdateAntenne: addOrUpdateAntenne,
      getAntenneByBenevoleId: getAntenneByBenevoleId,
      findAllFamiliesByAntenneId:findAllFamiliesByAntenneId,
      addOrUpdateFamily:addOrUpdateFamily,
      findFamilyById:findFamilyById,
      findAntenneById:findAntenneById,
      findAllActivitiesByType:findAllActivitiesByType,
      findAllBenevolesToValidateByAntenneId:findAllBenevolesToValidateByAntenneId
    };

    return service;

    function addOrUpdateBeneficiaire(beneficiaire) {
      var deferred = $q.defer();
      var benef = getBeneficiaire(beneficiaire);
      console.log(benef);
      db.put(benef)
        .then(function (doc) {
          $rootScope.$apply(function () {
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
      db.remove(beneficiaire).then(function (response) {
        console.log(response);
        deferred.resolve(true);
      }).catch(function (err) {
        console.log(err);
        deferred.reject(false);
      });
      return deferred.promise;
    }

    function findBeneficiaireById(beneficiaireId) {
      var deferred = $q.defer();
      db.get(beneficiaireId)
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

    function findAllBeneficiairesByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('benef') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: antenneId,
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

    function saveBeneficiaires(beneficiaires) {
      var deferred = $q.defer();
      var beneficiairesToCreate = [];
      var beneficiairesLength = beneficiaires === null ? 0 : beneficiaires.length;
      for (var i = 0; i < beneficiairesLength; i++) {
        var beneficiaire = beneficiaires[i];
        if(beneficiaire._id === undefined) {
          beneficiairesToCreate.push(getBeneficiaire(beneficiaire));
        }
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

    function getBeneficiaire(beneficiaire) {
      if (beneficiaire._rev === undefined) {
        beneficiaire = {
          _id: uuid.v4(),
          type: 'benef',
          code: beneficiaire.code,
          firstName: beneficiaire.firstName,
          lastName: beneficiaire.lastName,
          hasCard: beneficiaire.hasCard,
          antenneId: beneficiaire.antenneId
        };
      }
      return beneficiaire;
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
            benevoles.push(res.rows[i].doc);
          }
          deferred.resolve(benevoles);

        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function findAllBenevolesByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('benev') != -1 && doc.toValidate === false) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: antenneId,
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
        benevole = {
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
          antenneId: benevole.antenneId,
          associationId: benevole.associationId,
          type: 'benev',
          toValidate: false,
          activities: [],
          adminActivities: []
        };
      }
      return benevole;
    }

    function findAllDistributionsByAntenneId(antenneId) {
      var deferred = $q.defer();

      function map(doc) {
        if (doc.type !== undefined && doc.type.indexOf('FOOD') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(map, {key: antenneId, include_docs: true}).then(function (res) {
        console.log(res);
        var distributions = [];
        for (var i = 0; i < res.rows.length; i++) {
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
      db.get(distributionId)
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

    function findDistributionByIds(distributionIds) {
      var deferred = $q.defer();
      db.allDocs({
        include_docs: true,
        keys: distributionIds})
        .then(function (docs) {
          var distributions = [];
          for (var i = 0; i < docs.rows.length; i++) {
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

    function getDistribution(distribution) {
      if (distribution._rev === undefined) {
        distribution._id = uuid.v4();
        distribution.type = 'FOOD';
        distribution.dateCreation = new Date();
      }
      return distribution;
    }

    function getBeneficiaireByDistribution(bbd) {
      if (bbd._rev === undefined) {
        bbd._id = uuid.v4();
        bbd.type = 'bbd';
      }
      return bbd;
    }

    function addOrUpdateBeneficiaireByDistribution(_bbd) {
      var deferred = $q.defer();
      var bbd = getBeneficiaireByDistribution(_bbd);
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

    function findAllBeneficiaireByDistributionByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('bbd') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: antenneId,
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
      for (var i = 0; i < bbdsToDelete.length; i++) {
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
        key: antenneId,
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

    function getAbout(about) {
      if (about._rev === undefined) {
        var aboutModel = {
          _id : uuid.v4(),
          type : 'about',
          antenneId: about.antenneId,
          content: about.content
        };
      }
      return aboutModel;
    }

    function updateAbout(about) {
      var deferred = $q.defer();
      var aboutModel = getAbout(about);
      db.put(aboutModel)
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

      function myMapFunction(doc) {
        emit(doc.type);
      }

      db.query(myMapFunction, {
        key: 'asso',
        include_docs: true
      }).then(function (res) {

        var associations = [];
        for (var i = 0; i < res.rows.length; i++) {
          associations.push(res.rows[i].doc);
        }
        deferred.resolve(associations);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAssociation(association) {
      if (association._rev === undefined) {
        association._id = uuid.v4();
        association.type = 'asso';
      }
      return association;
    }

    function addOrUpdateAntenne(antenne) {
      var deferred = $q.defer();
      var ante = getAntenne(antenne);
      console.log(ante);
      db.put(ante)
        .then(function (doc) {
          $rootScope.$apply(function () {
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

      function myMapFunction(doc) {
        emit(doc.type);
      }

      db.query(myMapFunction, {
        key: 'ante',
        include_docs: true
      }).then(function (res) {

        var antennes = [];
        for (var i = 0; i < res.rows.length; i++) {
          antennes.push(res.rows[i].doc);
        }
        deferred.resolve(antennes);

      }).catch(function (err) {
        console.log(err);
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAntenne(antenne) {
      if (antenne._rev === undefined) {
        antenne._id = uuid.v4();
        antenne.type = 'ante';
      }
      return antenne;
    }

    function getAntenneByBenevoleId(benevoleId) {
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
            for (var baIndex = 0; baIndex < res.rows.length; baIndex++) {
              antennes.push(res.rows[baIndex].doc._id);
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

    function findAllFamiliesByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('family') != -1) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: antenneId,
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

    function addOrUpdateFamily(family) {
      var deferred = $q.defer();
      var fami = getFamily(family);
      console.log(fami);
      db.put(fami)
        .then(function (doc) {
          $rootScope.$apply(function () {
            fami._rev = doc.rev;
            return deferred.resolve(fami);
          });
        }).catch(function (err) {
          console.log(err);
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getFamily(family) {
      if (family._rev === undefined) {
        family = {
          _id: uuid.v4(),
          type: 'family',
          members : family.members,
          antenneId: family.antenneId,
          description: family.description
        };
      }
      return family;
    }

    function findFamilyById(familyId) {
      var deferred = $q.defer();
      db.get(familyId)
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

    function findAntenneById(antenneId) {
      var deferred = $q.defer();
      db.get(antenneId)
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

    function findAllActivitiesByType(activities) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
          emit(doc.type);
      }

      db.query(myMapFunction, {
        keys: activities,
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

//    function getActivity(acti) {
//      if (acti._rev === undefined) {
//        var acti = {
//          _id : uuid.v4(),
//          type : 'acti',
//          antenneId: acti.antenneId,
//          content: acti.content,
//          createDate: new Date(),
//          description: acti.description
//        };
//      }
//      return acti;
//    }

    function findAllBenevolesToValidateByAntenneId(antenneId) {
      var deferred = $q.defer();

      function myMapFunction(doc) {
        if (doc.type !== undefined && doc.type.indexOf('benev') != -1 && doc.toValidate === true) {
          emit(doc.antenneId);
        }
      }

      db.query(myMapFunction, {
        key: antenneId,
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

  }
})();
