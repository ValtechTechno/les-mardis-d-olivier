(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('commonService', commonService);

  function commonService($translate) {
    var service = {
      userFormValidation: userFormValidation,
      benevoleFormValidation: benevoleFormValidation,
      associationFormValidation: associationFormValidation,
      antenneFormValidation: antenneFormValidation,
      searchBeneficiaire: searchBeneficiaire,
      searchBenevole: searchBenevole,
      searchAssociation: searchAssociation,
      searchAntenne: searchAntenne,
      searchFamily: searchFamily,
      initNextCode:initNextCode
    };

    return service;

    // Specific filter to avoid search in comments
    function searchBeneficiaire(searchText, beneficiaire) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(beneficiaire.code !== undefined && beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
    }

    function searchBenevole(searchText, benevole) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(benevole.code !== undefined && benevole.code.toString()) || reg.test(benevole.lastName) || reg.test(benevole.firstName);
    }

    function searchAssociation(searchText, association) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(association.name !== undefined && association.name.toString());
    }

    function searchAntenne(searchText, antenne) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(antenne.name !== undefined && antenne.name.toString()) || reg.test(antenne.associationName !== undefined && antenne.associationName.toString());
    }

    function searchFamily(searchText, family) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(family.description !== undefined && family.description.toString());
    }

    function notUniqueBeneficiaire(lastName, firstName) {
      throw {type: "functional", message: $translate.instant("beneficiaire.error.alreadyExist", { lastName:lastName, firstName:firstName})};
    }

    function notUniqueEmail(email) {
      throw {type: "functional", message: "L'addresse " + email + " est déjà utilisée"};
    }

    function notUniqueAssociation(name) {
      throw {type: "functional", message: "L'association " + name + " existe déjà"};
    }

    function notUniqueAntenne(antenneName, associationName) {
      throw {type: "functional", message: "L'antenne " + antenneName + " existe déjà pour l'association "+associationName};
    }

    function userFormValidation(beneficiaires, lastName, firstName, id, isUpdate) {
      if (isUpdate === false) {
        if (beneficiaires.filter(function (beneficiaire) {
            return (beneficiaire.firstName.toLowerCase() === firstName.toLowerCase() &&
            beneficiaire.lastName.toLowerCase() === lastName.toLowerCase());
          }).length > 0) {
          notUniqueBeneficiaire(lastName, firstName);
        }
      }
      else if (isUpdate === true) {
        if (beneficiaires.filter(function (beneficiaire) {
            return (beneficiaire.firstName.toLowerCase() === firstName.toLowerCase() &&
            beneficiaire.lastName.toLowerCase() === lastName.toLowerCase() && beneficiaire._id !== id);
          }).length > 0) {
          notUniqueBeneficiaire(lastName, firstName);
        }
      }
      return true;
    }

    function associationFormValidation(associations, name) {
        if (associations.filter(function (association) {
          return (association.name.toLowerCase() === name.toLowerCase());
        }).length > 0) {
          notUniqueAssociation(name);
        }
      return true;
    }

    function antenneFormValidation(antennes, association, antenneName) {
      if (antennes.filter(function (antenne) {
        return (antenne.name.toLowerCase() === antenneName.toLowerCase() && association._id === antenne.associationId);
      }).length > 0) {
        notUniqueAntenne(antenneName, association.name);
      }
      return true;
    }

    function benevoleFormValidation(benevoles, email, id, isUpdate) {
      if (benevoles.filter(function (benevole) {
        return (benevole.email === email);
      }).length > 0 && isUpdate === false) {
        notUniqueEmail(email);
      }
      if (benevoles.filter(function (benevole) {
        return (benevole.email === email && benevole._id !== id);
      }).length > 0 && isUpdate === true) {
        notUniqueEmail(email);
      }
      return true;
    }

    function initNextCode(list){
      var nextCode = 1;
      if (list !== null) {
        for (var i = 0; i < list.length; i++) {
          if (nextCode <= list[i].code) {
            nextCode = list[i].code;
            nextCode++;
          }
        }
      }
      return nextCode;
    }
  }
})();

formatDate = function (date) {
  if(date === undefined){
    date = new Date();
  }
  var month = (date.getMonth() + 1) + "";
  var pad = "00";
  var paddedMonth = pad.substring(0, pad.length - month.length) + month;
  var day = date.getDate().toString();
  if (day.length == 1) {
    day = "0" + day;
  }
  return date.getFullYear() + "-" + paddedMonth + "-" + day;
};

getNewBeneficiaire = function(code, lastName, firstName, hasCard, antenneId){
  var newBeneficiaire = {
    code: code,
    firstName: firstName,
    lastName: lastName,
    isPresent: false,
    hasCard: hasCard,
    antenneId: antenneId
  };
  return newBeneficiaire;
};

getNewBenevole = function(lastName, firstName, email, phoneNumber, associationId, antenneId){
  var newBenevole = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    englishLevel:0,
    spanishLevel:0,
    germanLevel:0,
    antenneId: antenneId,
    associationId: associationId
  };
  return newBenevole;
};

getNewAdminBenevole = function(lastName, firstName, email, phoneNumber, password, associationId, antenneId){
  var newBenevole = getNewBenevole(lastName, firstName, email, phoneNumber, associationId, antenneId);
  newBenevole.isAdmin = true;
  newBenevole.password = password;
  return newBenevole;
};

getNewAccount = function(lastName, firstName, email, phoneNumber, password){
  var newAccount = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    englishLevel:0,
    spanishLevel:0,
    germanLevel:0
  };
  newAccount.isAdmin = false;
  newAccount.password = password;
  return newAccount;
};

getNewAssociation = function(name){
  var newAssociation = {
    name: name
  };
  return newAssociation;
};

getNewAntenne = function(association, antenneName){
  var newAntenne = {
    name: antenneName,
    associationId: association._id,
    activities:['FOOD','TRAVEL'] // TODO for test
  };
  return newAntenne;
};
