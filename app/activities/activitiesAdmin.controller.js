(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('ActivitiesAdminController', ActivitiesAdminController);

  function ActivitiesAdminController($scope, dataService, $rootScope, $location, activitiesService) {

    $scope.openActivitiesAdmin = function () {
      $scope.activities = activitiesService.getActivities($rootScope.account.antenne.activities);
      if($scope.activities === undefined || $scope.activities === null || $scope.activities.length === 0){
        $location.path('/');
        throw {type: "functional", message: 'Aucune activités.'};
      }
      $scope.currentActivity = $scope.activities[0];
      $scope.addMode = false;
      $scope.members = [];
      $scope.getBenevoles();
    };

    $scope.getBenevoles = function () {
      if ($scope.benevoles === null || $scope.benevoles === undefined) {
        $scope.benevoles = [];
      }
      dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
        .then(function (benevoles) {
          $scope.benevoles = benevoles;
          $scope.benevolesWithoutMembers = angular.copy($scope.benevoles);
          $scope.updateActivityContent();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
        });
    };

    $scope.goToAddMode = function() {
      $scope.addMode = true;
    };

    $scope.cancelAddMode = function() {
      $scope.addMode = false;
    };

    $scope.addMember = function(member) {
      if(member.adminActivities === undefined || member.adminActivities === null){
        member.adminActivities = [];
      }
      member.adminActivities.push($scope.currentActivity.id);
      $scope.members.push(member);
      $scope.addMode = false;
      $scope.updateBenevole(member);
    };

    $scope.removeMember = function(member) {
      var membersIndex = $scope.members.indexOf(member);
      $scope.members.splice(membersIndex, 1);
      member.adminActivities.splice(member.adminActivities.indexOf($scope.currentActivity.id), 1);
      $scope.updateBenevole(member);
    };

    $scope.updateBenevole = function(member) {
      var beneIndex = dataService.addOrUpdateBenevole(member).then(function (benevole) {
          member = benevole;
          $scope.benevoles.splice(beneIndex, 1);
          $scope.benevoles.push(member);
        });
    };

    $scope.updateActivityContent = function() {
      $scope.members = [];
      $scope.benevolesWithoutMembers = angular.copy($scope.benevoles);

      $scope.benevoles.forEach(function(benev) {
        if(benev.adminActivities !== undefined && benev.adminActivities.indexOf($scope.currentActivity.id) !== -1){
          $scope.members.push(benev);
        }
      });
      $scope.members.forEach(function (member) {
        var membersIndex = $scope.benevolesWithoutMembers.indexOf(member);
        $scope.benevolesWithoutMembers.splice(membersIndex, 1);
      });
    };

    $scope.openActivitiesAdmin();

  }

})();
