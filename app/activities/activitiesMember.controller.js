(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('ActivitiesMemberController', ActivitiesMemberController);

  function ActivitiesMemberController($scope, $rootScope, $location, dataService, activitiesService) {

    var MINE_KEY = 'MINE';

    $scope.openActivitiesMember = function () {
      $scope.myActivities = $scope.getMyActivities($rootScope);
      var rawActivities =  $scope.myActivities.length > 1 ? [MINE_KEY].concat($rootScope.account.antenne.activities) : $rootScope.account.antenne.activities;
      $scope.activities = activitiesService.getActivities(rawActivities, $scope.myActivities, MINE_KEY);

      if($scope.activities.length === 0){
        throw {type: "functional", message: 'Aucune activités.'};
      }

      $scope.currentActivity = $scope.activities[activitiesService.getSelectedActivityIndex($scope.activities, $scope.myActivities)];
      $scope.updateActivityContent();
    };

    $scope.updateActivityContent = function() {
      var actToGet = [];
      if($scope.currentActivity.id === MINE_KEY){
        actToGet = actToGet.concat($scope.myActivities);
      }else{
        actToGet.push($scope.currentActivity.id);
      }
      dataService.findAllActivitiesByType(actToGet).then(function(acts){
        $scope.currentActivities = acts.sort(function(a,b){
          return new Date(b.dateCreation) - new Date(a.dateCreation);
        });
      })
      .catch(function () {
        throw {type: "functional", message: 'Impossible de charger la liste des activités.'};
      });
    };

    $scope.getMyActivities = function($rootScope){
      var mineAct = [];
      if($rootScope.account.adminActivities !== undefined && $rootScope.account.adminActivities.length > 0) {
        mineAct = mineAct.concat($rootScope.account.adminActivities);
      }
      if($rootScope.account.memberActivities !== undefined && $rootScope.account.memberActivities.length > 0) {
        mineAct = mineAct.concat($rootScope.account.memberActivities);
      }
      return mineAct;
    };

    $scope.openActivity = function (activity) {
      if(activity.type === 'FOOD') {
        $location.path("/distributions/" + activity._id);
      }
    };

    $scope.getActivityDescription = function (acti) {
      return activitiesService.getActivityDescription(acti);
    };

    $scope.openActivitiesMember();

  }

})();
