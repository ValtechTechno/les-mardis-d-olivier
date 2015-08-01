(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('ActivitiesRespController', ActivitiesRespController);

  function ActivitiesRespController($scope, dataService, $rootScope, $location, activitiesService) {

    $scope.openActivitiesResp = function () {
      $scope.activities =  activitiesService.getActivities($scope.getActivities($rootScope));
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

    $scope.getActivities = function(rootScope) {
      var acts = [];
      if(rootScope.account.adminActivities !== undefined && rootScope.account.adminActivities !== null && rootScope.account.adminActivities.length > 0){
        acts = rootScope.account.adminActivities;
      }
      return acts;
    };

    $scope.goToAddMode = function() {
      $scope.addMode = true;
    };

    $scope.cancelAddMode = function() {
      $scope.addMode = false;
    };

    $scope.addMember = function(member) {
      if(member.memberActivities === undefined || member.memberActivities === null){
        member.memberActivities = [];
      }
      member.memberActivities.push($scope.currentActivity.id);
      $scope.members.push(member);
      $scope.addMode = false;
      $scope.updateBenevole(member);
    };

    $scope.removeMember = function(member) {
      var membersIndex = $scope.members.indexOf(member);
      $scope.members.splice(membersIndex, 1);
      member.memberActivities.splice(member.memberActivities.indexOf($scope.currentActivity.id), 1);
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
        if(benev.memberActivities !== undefined && benev.memberActivities.indexOf($scope.currentActivity.id) !== -1){
          $scope.members.push(benev);
        }
      });
      $scope.members.forEach(function (member) {
        var membersIndex = $scope.benevolesWithoutMembers.indexOf(member);
        $scope.benevolesWithoutMembers.splice(membersIndex, 1);
      });
    };

    $scope.openActivitiesResp();

  }

})();
