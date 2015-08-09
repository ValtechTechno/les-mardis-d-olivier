(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('AntenneAdminController', AntenneAdminController);

  function AntenneAdminController ($scope, dataService, commonService, $location, $rootScope, LoginService) {

    $scope.FOOD_KEY = 'FOOD';
    $scope.TRAVEL_KEY = 'TRAVEL';
    $scope.ABOUT_KEY = 'ABOUT';
    $scope.HOMEPAGE_KEY = 'HOMEPAGE';
    $scope.HOMEPAGE_CALENDAR_KEY = 'HOMEPAGE_CALENDAR';

    $scope.openAntenneAdmin = function () {

      dataService.findAntenneById($rootScope.account.antenneId)
        .then(function (doc) {
          $scope.currentAntenne = doc;
          $scope.displayAntenneActivities();
          $scope.displayAntenneFeatures();
        })
        .catch(function (err) {
        });
    };

    $scope.saveAntenneAdmin = function () {
      // charge all the antennes to check if there isn't already a couple of first name + last name
      dataService.findAllAntennes()
        .then(function (antennes) {
          $scope.antennes = antennes;
          $scope.updateAntenne();
        })
    };

    $scope.updateAntenneActivities = function (key) {
      var indexActi = $scope.currentAntenne.activities.indexOf(key);
      if(indexActi === -1){
        $scope.currentAntenne.activities.push(key);
      }else{
        $scope.currentAntenne.activities.splice(indexActi, 1);
      }
      console.log($scope.currentAntenne.activities);
      $scope.displayAntenneActivities();
    };

    $scope.updateAntenneFeatures = function (key) {
      var indexActi = $scope.currentAntenne.features.indexOf(key);
      if(indexActi === -1){
        $scope.currentAntenne.features.push(key);
      }else{
        $scope.currentAntenne.features.splice(indexActi, 1);
        if(key === $scope.HOMEPAGE_KEY){
          var indexCal = $scope.currentAntenne.features.indexOf($scope.HOMEPAGE_CALENDAR_KEY);
          $scope.currentAntenne.features.splice(indexCal, 1);
        }
      }

      console.log($scope.currentAntenne.features);
      $scope.displayAntenneFeatures();
    };

    $scope.displayAntenneFeatures = function () {
      $scope.hasAbout = false;

      $scope.currentAntenne.features.forEach(function(acti){
        if(acti === $scope.ABOUT_KEY) {
          $scope.hasAbout = true;
        }
        if(acti === $scope.HOMEPAGE_KEY) {
          $scope.hasHomepage = true;
        }
        if(acti === $scope.HOMEPAGE_CALENDAR_KEY) {
          $scope.hasHomepageCalendar = true;
        }
      });
    };

    $scope.displayAntenneActivities = function () {
      $scope.isFood = false;
      $scope.isTravel = false;

      $scope.currentAntenne.activities.forEach(function(acti){
        if(acti === $scope.FOOD_KEY) {
          $scope.isFood = true;
        }
        if(acti === $scope.TRAVEL_KEY) {
          $scope.isTravel = true;
        }
      });
    };

    $scope.updateAntenne = function () {
      if (commonService.antenneFormValidation($scope.antennes, {_id:$scope.currentAntenne.associationId}, $scope.currentAntenne)) {
        dataService.addOrUpdateAntenne($scope.currentAntenne)
          .then(function () {
            $rootScope.account.antenne = $scope.currentAntenne;
            $scope.openAntenneList();
          }).catch(function (err) {
            if (err.status === 409) {
              throw {
                type: "functional",
                message: 'Un utilisateur vient de modifier ce bénévole. Veuillez recharger la page et recommencer.'
              };
            }else{
              throw {
                type: "functional",
                message: 'Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer."};'
              };
            }
          });
      }
    };

    $scope.openAntenneList = function () {
      $location.path("/");
    };

    $scope.openAntenneAdmin();
  }

})();
