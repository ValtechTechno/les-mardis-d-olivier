(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('activitiesService', activitiesService);

  function activitiesService($translate) {
    var service = {
      getActivities: getActivities,
      getSelectedActivityIndex:getSelectedActivityIndex,
      getActivityDescription:getActivityDescription
    };

    return service;

    function getActivities(list, myActivities, mineKey) {
      var activities = [];
      list.forEach(function(acti){
        var myActivitiesDetail = acti === mineKey && myActivities !== undefined ? " ("+getMyActivitiesDisplay(myActivities)+")" : '';
        activities.push({id : acti, name : $translate.instant('lang.'+acti)+myActivitiesDetail, description : getActivityDescription(acti)});
      });
      return activities;
    }

    function getMyActivitiesDisplay(myActivities){
      var actDisplay = [];
      myActivities.forEach(function(acti){
        actDisplay.push($translate.instant('lang.'+acti));
      });
      return actDisplay;
    }

    function getSelectedActivityIndex(activities, myActivities) {
      var selectedActivityIndex = 0;

      if (myActivities.length == 1) {
        activities.forEach(function (act) {
          if (act.id === myActivities[0]) {
            selectedActivityIndex = activities.indexOf(act);
            return true;
          }
        });
      }

      return selectedActivityIndex;
    }

    function getActivityDescription(activity){
      var actDescription = '';
      if(activity.type === 'FOOD'){
        actDescription = "Distribution du "+activity.distributionDate+", repas prévus : "+activity.nbPlannedMeals;
      }
      return actDescription;
    }

  }
})();
