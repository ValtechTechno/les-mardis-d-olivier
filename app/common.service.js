(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('commonService', commonService);

  function commonService() {
    var service = {
      userFormValidation: userFormValidation,
      searchBeneficiaire: searchBeneficiaire
    };

    return service;

    // Specific filter to avoid search in comments
    function searchBeneficiaire(searchText, beneficiaire) {
      var reg = new RegExp(searchText, 'i');
      return !searchText || reg.test(beneficiaire.code != undefined && beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
    }

    function notUniqueBeneficiaire(lastName, firstName) {
      throw {type: "functional", message: "Le bénéficiaire " + lastName + " " + firstName + " existe déjà"};
    }

    function userFormValidation(beneficiaires, lastName, firstName, id, isUpdate) {
      if (beneficiaires.filter(function (beneficiaire) {
          return (beneficiaire.firstName === firstName &&
          beneficiaire.lastName === lastName);
        }).length > 0 && isUpdate == false) {
        notUniqueBeneficiaire(lastName, firstName);
      }
      if (beneficiaires.filter(function (beneficiaire) {
        return (beneficiaire.firstName === firstName &&
          beneficiaire.lastName === lastName && beneficiaire.id !== id);
      }).length > 0 && isUpdate == true) {
        notUniqueBeneficiaire(lastName, firstName);
      }
      return true;
    }
  }
})();

formatDate = function (date) {
  if(date == undefined){
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
    id: nextId,
    code: code,
    firstName: firstName,
    lastName: lastName,
    isPresent: false,
    hasCard: hasCard
  };
  return newBeneficiaire;
}

getNextId = function(list){
  var nextId;
  if (list.length == 0) {
    nextId = '1';
  } else {
    nextId = parseInt(list[list.length - 1].id) + 1 + '';
  }
  return nextId;
}
