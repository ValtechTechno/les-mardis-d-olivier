(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BenevoleCreateController', BenevoleCreateController);

  function BenevoleCreateController ($scope, dataService, commonService, $location) {

    $scope.addBenevoleFromNoAuth = function () {
      $scope.addBenevole();
    };

    $scope.openBenevoleCreate = function(){
      if ($scope.benevoles === null || $scope.benevoles === undefined) {
        $scope.benevoles = [];
      }
      dataService.findAllBenevoles()
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.currentBenevole = {};
        })
        .catch(function () {
          throw {type: "functional", message: 'Erreur technique. Veuillez recharger la page.'};
        });
    };

    $scope.addBenevole = function () {
      if (commonService.benevoleFormValidation($scope.benevoles, $scope.currentBenevole.email, $scope.currentBenevole._id, false)) {
        var newBenevole = getNewAdminBenevole(getNextIdInUnsortedList($scope.benevoles), $scope.currentBenevole.lastName, $scope.currentBenevole.firstName, $scope.currentBenevole.email, $scope.currentBenevole.phoneNumber);
        dataService.addOrUpdateBenevole(newBenevole)
          .then(function (added) {
            $location.path("/login");
          })
          .catch(function () {
              throw {type: "functional", message: 'Le bénévole n\'a pas été ajouté suite à une erreur technique.'};
          });
      }
    };

    $scope.openBenevoleCreate();

  }

})();
