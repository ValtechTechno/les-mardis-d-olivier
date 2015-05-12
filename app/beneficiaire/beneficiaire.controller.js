(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireController', BeneficiaireController);

  function BeneficiaireController ($scope, dataService, commonService, $location) {
    $scope.openBeneficiaireList = function () {
      if ($scope.beneficiaires === null || $scope.beneficiaires === undefined) {
        $scope.beneficiaires = [];
      }
      dataService.findAllBeneficiaires()
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
          $scope.resetAddBeneficiareForm();
        })
        .catch(function (err) {
            throw {type: "functional", message: 'Impossible de charger la liste des bénéficiaires.'};
        });
        $scope.excludedFilter = false;
        $scope.hasCardFilter = false;
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope.searchText, beneficiaire);
    };

    $scope.searchExcluded = function (beneficiaire) {
      return ($scope.excludedFilter === true && beneficiaire.excluded === true) || ($scope.excludedFilter === false);
    };

    $scope.searchHasCard = function (beneficiaire) {
      return ($scope.hasCardFilter === true && beneficiaire.hasCard === false) || ($scope.hasCardFilter === false);
    };

    $scope.addBeneficiaireFromList = function () {
      $scope.addBeneficiaire();
    };

    $scope.openBeneficiaireDetail = function(beneficiaireId) {
      $location.path("/beneficiaires/" + beneficiaireId);
    };

    $scope.resetAddBeneficiareForm = function() {
      $scope.currentBeneficiaire = {code: $scope.initNextCode(), hasCard: true};
    };

    $scope.initNextCode = function() {
      var nextCode = 1;
      if ($scope.beneficiaires !== null) {
        for (var i = 0; i < $scope.beneficiaires.length; i++) {
          if (nextCode <= $scope.beneficiaires[i].code) {
            nextCode = $scope.beneficiaires[i].code;
            nextCode++;
          }
        }
      }
      return nextCode;
    };

    $scope.addBeneficiaire = function () {
      if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire._id, false)) {
        var newBeneficiaire = getNewBeneficiaire(getNextIdInUnsortedList($scope.beneficiaires), $scope.currentBeneficiaire.code, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire.hasCard);
        dataService.addOrUpdateBeneficiaire(newBeneficiaire)
          .then(function (added) {
            $scope.beneficiaires.push(added);
            $scope.resetAddBeneficiareForm();
          })
          .catch(function (err) {
              throw {type: "functional", message: 'Le bénéficiaire n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.openBeneficiaireList();
  }

})();
