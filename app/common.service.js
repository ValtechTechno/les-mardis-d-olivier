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
      searchBeneficiaire: searchBeneficiaire,
      searchBenevole: searchBenevole,
      searchAssociation: searchAssociation
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

    function notUniqueBeneficiaire(lastName, firstName) {
      throw {type: "functional", message: $translate.instant("beneficiaire.error.alreadyExist", { lastName:lastName, firstName:firstName})};
    }

    function notUniqueEmail(email) {
      throw {type: "functional", message: "L'addresse " + email + " est déjà utilisée"};
    }

    function notUniqueAssociation(name) {
      throw {type: "functional", message: "L'association " + name + " existe déjà"};
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

getNewBeneficiaire = function(nextId, code, lastName, firstName, hasCard){
  var newBeneficiaire = {
    _id: nextId,
    code: code,
    firstName: firstName,
    lastName: lastName,
    isPresent: false,
    hasCard: hasCard
  };
  return newBeneficiaire;
};

getNewBenevole = function(nextId, lastName, firstName, email, phoneNumber){
  var newBenevole = {
    _id: nextId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    englishLevel:0,
    spanishLevel:0,
    germanLevel:0
  };
  return newBenevole;
};

getNewAdminBenevole = function(nextId, lastName, firstName, email, phoneNumber){
  var newBenevole = getNewBenevole(nextId, lastName, firstName, email, phoneNumber);
  newBenevole.isAdmin = true;
  newBenevole.password = 'test';
  return newBenevole;
};

getNewAssociation = function(nextId, name){
  var newAssociation = {
    _id: nextId,
    name: name
  };
  return newAssociation;
};


getNextIdInUnsortedList = function (list) {
  var nextId = 1;
  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      var id = Number(list[i]._id);
      if (id >= nextId) {
        nextId = ++id;
      }
    }
  }
  return nextId + '';
};

