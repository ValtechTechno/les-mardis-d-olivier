(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('commonService', commonService);

  function commonService($translate) {
    var service = {
      userFormValidation: userFormValidation,
      searchBeneficiaire: searchBeneficiaire
    };

    return service;

    // Specific filter to avoid search in comments
    function searchBeneficiaire(searchText, beneficiaire) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(beneficiaire.code !== undefined && beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
    }

    function notUniqueBeneficiaire(lastName, firstName) {
      throw {type: "functional", message: $translate.instant("beneficiaire.error.alreadyExist", { lastName:lastName, firstName:firstName})};
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

