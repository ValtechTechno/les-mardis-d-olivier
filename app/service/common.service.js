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

    service.init = function ($scope, beneficiairesService) {
      $scope.$watch('beneficiaires', function (newValue, oldValue) {
        if (newValue.length != oldValue.length && $scope.readOnly == (false || undefined)){
          var cleanBeneficiairesList = [];
          for (var i = 0; i < newValue.length; i++) {
            var beneficiaire = newValue[i];
            cleanBeneficiairesList.push({
              id: beneficiaire.id,
              code: beneficiaire.code,
              firstName: beneficiaire.firstName,
              lastName: beneficiaire.lastName
            });
          }
          beneficiairesService.saveBeneficiaires(cleanBeneficiairesList);
        }
      }, true);
    };

    return service;

    // Specific filter to avoid search in comments
    function searchBeneficiaire($scope, beneficiaire) {
      var reg = new RegExp($scope.searchText, 'i');
      return !$scope.searchText || reg.test(beneficiaire.code != undefined && beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
    }

    function userFormValidation($scope, isUpdate) {
      if ($scope.currentBeneficiaire.lastName === undefined || $scope.currentBeneficiaire.lastName.length == 0) {
        return false;
      }
      if ($scope.currentBeneficiaire.firstName === undefined || $scope.currentBeneficiaire.firstName.length == 0) {
        return false;
      }

      if ($scope.beneficiaires.filter(function (beneficiaire) {
          return (beneficiaire.firstName === $scope.currentBeneficiaire.firstName &&
          beneficiaire.lastName === $scope.currentBeneficiaire.lastName);
        }).length > 0 && isUpdate == false) {
        $scope.currentError = {isBeneficiaireNotUnique: true};
        return false;
      }

      if ($scope.beneficiaires.filter(function (beneficiaire) {
          return (beneficiaire.code === $scope.currentBeneficiaire.code);
        }).length > 0 && isUpdate == false) {
        $scope.currentError = {isCodeNotUnique: true};
        return false;
      }

      if ($scope.beneficiaires.filter(function (beneficiaire) {
          return (beneficiaire.code === $scope.currentBeneficiaire.code && beneficiaire.id !== $scope.currentBeneficiaire.id);
        }).length > 0 && isUpdate == true) {
        $scope.currentError = {isCodeNotUnique: true};
        return false;
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

getNewBeneficiaire = function(nextId, code, lastName, firstName){
  var newBeneficiaire = {
    id: nextId,
    code: code,
    firstName: firstName,
    lastName: lastName,
    isPresent: false
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
}
