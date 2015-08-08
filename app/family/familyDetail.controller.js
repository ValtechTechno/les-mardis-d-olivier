(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('FamilyDetailController', FamilyDetailController);

  function FamilyDetailController($scope, $routeParams, dataService, $location, $rootScope, commonService) {

    $scope.openFamilyDetail = function () {
      $scope.addMode = false;
      $scope.membersUpdated = false;
      $scope.members = [];
      $scope.getBeneficiaires();
    };

    $scope.goToAddMode = function() {
      $scope.addMode = true;
    };

    $scope.cancelAddMode = function() {
      $scope.addMode = false;
    };

    $scope.addMember = function(member) {
      $scope.members.push(member);
      $scope.currentFamily.members.push(member._id);
      $scope.addMode = false;
      $scope.membersUpdated = true;
    };

    $scope.openFamilyList = function(){
      $location.path("/famillies");
    };

    $scope.saveFamilyDetail = function(){
      if($scope.currentFamily.members.length === 0){
        return false;
      }
      if($scope.membersUpdated === true) {
        var description = undefined;
        $scope.members.forEach(function (member) {
          description = (description === undefined ? '' : description + ', ' ) + member.firstName + " " + member.lastName
        });
        $scope.currentFamily.description = description;
      }
      dataService.addOrUpdateFamily($scope.currentFamily)
        .then(function (family){
          $scope.currentFamily = family;
        }).catch(function (err) {
          throw {type: "functional", message: 'Impossible de sauvegarder les modifications.'};
        });
    };

    $scope.removeMember = function(member) {
      var membersIndex = $scope.members.indexOf(member);
      $scope.members.splice(membersIndex, 1);
      var currentMembersIndex = $scope.currentFamily.members.indexOf(member._id);
      $scope.currentFamily.members.splice(currentMembersIndex, 1);
      $scope.membersUpdated = true;
    };

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope.searchText, beneficiaire);
    };

    $scope.openBeneficiaireDetail = function(beneficiaireId) {
      $location.path("/beneficiaires/" + beneficiaireId);
    };

    $scope.getBeneficiaires = function () {
      if ($scope.beneficiaires === null || $scope.beneficiaires === undefined) {
        $scope.beneficiaires = [];
      }
      dataService.findAllBeneficiairesByAntenneId($rootScope.account.antenneId)
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
          $scope.getFamily();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénéficiaires.'};
        });
    };

    $scope.getFamily = function(){
      if ($routeParams.familyId === '0') {
        $scope.currentFamily = {members:[], antenneId:$rootScope.account.antenneId};
        $scope.members = [];
      } else if ($routeParams.familyId !== undefined) {

        dataService.findFamilyById($routeParams.familyId)
          .then(function (doc) {
            $scope.currentFamily = doc;
            $scope.currentFamily.members.forEach(function (member) {
              $scope.beneficiaires.forEach(function (benef) {
                if(member === benef._id){
                  $scope.members.push(benef);
                }
              });
            });

            $scope.members.forEach(function (member) {
              var membersIndex = $scope.beneficiaires.indexOf(member);
              $scope.beneficiaires.splice(membersIndex, 1);
            });
          })
          .catch(function (err) {
            if (err.status === 404) {
              $scope.createFamilyErrorWithReturnToList('La famille n\'existe pas.');
            } else {
              $scope.createFamilyErrorWithReturnToList('Impossible de récupérer cette famille, une erreur technique est survenue.');
            }
          });
      }
    };

    $scope.createFamilyErrorWithReturnToList = function (message, technical) {
      $location.path("/families");
      throw {
        type: technical === true ? "technical" : "functional",
        message: message
      };
    };

    $scope.openFamilyList = function () {
      $location.path("/families");
    };

    $scope.openFamilyDetail();
  }

})();
