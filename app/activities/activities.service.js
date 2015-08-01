(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .service('activitiesService', activitiesService);

  function activitiesService($translate) {
    var service = {
      getActivities: getActivities
    };

    return service;

    function getActivities(list, myActivities, mineKey) {
      var activities = [];
      list.forEach(function(acti){
        var myActivitiesDetail = acti === mineKey && myActivities !== undefined ? " ("+getMyActivitiesDisplay(myActivities)+")" : '';
        activities.push({id : acti, name : $translate.instant('lang.'+acti)+myActivitiesDetail});
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

  }
})();
