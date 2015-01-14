(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('commonService', commonService);

  function commonService() {
    var service = {
      resetAddBeneficiareForm: resetAddBeneficiareForm,
      initNextCode: initNextCode,
      searchBeneficiaire: searchBeneficiaire,
      openBeneficiaireDetail: openBeneficiaireDetail,
      userFormValidation: userFormValidation,
      addBeneficiaire: addBeneficiaire
    };

    service.init = function ($scope, beneficiairesService) {
      $scope.$watch('beneficiaires', function (newValue, oldValue) {
        if (newValue.length != oldValue.length) { //&& $scope.readOnly == false
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

    function resetAddBeneficiareForm($scope) {
      $scope.currentError = {};
    }

    function initNextCode($scope) {
      var nextCode = 1;
      if ($scope.beneficiaires != null) {
        for (var i = 0; i < $scope.beneficiaires.length; i++) {
          if (nextCode <= $scope.beneficiaires[i].code) {
            nextCode = $scope.beneficiaires[i].code;
            nextCode++;
          }
        }
      }
      return nextCode;
    }

    // Specific filter to avoid search in comments
    function searchBeneficiaire($scope, beneficiaire) {
      var reg = new RegExp($scope.searchText, 'i');
      return !$scope.searchText || reg.test(beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
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

    function addBeneficiaire($scope) {
      if (userFormValidation($scope, false)) {
        var nextId;
        if ($scope.beneficiaires.length == 0) {
          nextId = '1';
        } else {
          nextId = parseInt($scope.beneficiaires[$scope.beneficiaires.length - 1].id) + 1 + '';
        }
        var newBeneficiaire = {
          id: nextId,
          code: $scope.currentBeneficiaire.code,
          firstName: $scope.currentBeneficiaire.firstName,
          lastName: $scope.currentBeneficiaire.lastName,
          isPresent: true
        };
        $scope.beneficiaires.push(newBeneficiaire);
        return newBeneficiaire;
      } else {
        return false
      }
    }

    function openBeneficiaireDetail($scope, beneficiaire, fromDistribution) {
      $scope.currentBeneficiaire = beneficiaire;
      $scope.fromDistribution = fromDistribution;
      $scope.currentPage = {beneficiaireDetail: true};
    }

  }
})();
