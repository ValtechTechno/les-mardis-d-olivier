(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('HomepageController', HomepageController);

  function HomepageController($scope, activitiesService, $rootScope, dataService, $location) {

    var ALL_KEY = 'ALL';

    function getCurrentMonthDisplay(date) {
      var rawDate = $.datepicker.formatDate("MM", date);
      return rawDate.substr(0, 1).toUpperCase() + rawDate.substr(1);
    }

    $scope.updateCurrentMonthDisplay = function () {
      $scope.currentMonthDisplayed = getCurrentMonthDisplay($scope.calendarDay);
    };

    $scope.getActivitiesCurrentUser = function () {
      $scope.myActivities = $scope.getMyActivities($rootScope);
      $scope.myActivities.push('OTHER');

      $scope.eventTypes = angular.copy($scope.myActivities);
      $scope.eventTypes = activitiesService.getActivities($scope.eventTypes, $scope.eventTypes, undefined);

      var rawActivities = $scope.myActivities.length > 1 ? [ALL_KEY].concat($scope.myActivities) : $scope.myActivities;
      $scope.activities = activitiesService.getActivities(rawActivities, $scope.myActivities, ALL_KEY);

      $scope.currentActivity = $scope.activities[activitiesService.getSelectedActivityIndex($scope.activities, $scope.myActivities)];
    };

    $scope.getMyActivities = function ($rootScope) {
      var mineAct = [];
      if ($rootScope.account.adminActivities !== undefined && $rootScope.account.adminActivities.length > 0) {
        mineAct = mineAct.concat($rootScope.account.adminActivities);
      }
      if ($rootScope.account.memberActivities !== undefined && $rootScope.account.memberActivities.length > 0) {
        mineAct = mineAct.concat($rootScope.account.memberActivities);
      }
      if ($rootScope.account.isAdmin === true) {
        mineAct = mineAct.concat($rootScope.account.antenne.activities);
      }
      return mineAct;
    };

    $scope.updateCalendarContent = function () {
      if ($scope.currentActivity.id === ALL_KEY) {
        $scope.events = angular.copy($scope.rawEvents);
      } else {
        $scope.events = [];
        $scope.rawEvents.forEach(function (event) {
            if (event.activity === $scope.currentActivity.id) {
              $scope.events.push(event);
            }
          }
        );
      }
    };

    function getMembersToDisplay(memberList, eventSource) {
      var members = [];
      eventSource.members.forEach(function (memberId) {
        memberList.forEach(function (memberObject) {
          if(memberId === memberObject._id){
            members.push({id:memberId, name:memberObject.lastName + " " + memberObject.firstName});
          }
        });
      });
      return members;
    }

    $scope.showAddEventPopup = function (dateToAssign) {
      $scope.newEvent = {members:[], antenneId:$rootScope.account.antenneId, createdBy:$rootScope.account.userId};
      if (dateToAssign !== undefined) {
        $scope.newEvent.date = formatDate(dateToAssign);
      }
      angular.element('#newEventPopup').foundation('reveal', 'open');

      // to avoid the day view when clicking on the day number
      return false;
    };

    $scope.openBenevoleDetail = function (benevoleId) {
      angular.element('#detailEventPopup').foundation('reveal', 'close');
      $location.path("/benevoles/" + benevoleId);
    };

    $scope.newEventCancel = function () {
      angular.element('#newEventPopup').foundation('reveal', 'close');
    };

    $scope.newEventAdd = function () {
      if($scope.newEvent.hour === undefined){
        $scope.newEvent.hour = 0;
      }
      if($scope.newEvent.minute === undefined){
        $scope.newEvent.minute = 0;
      }
      if($scope.newEvent.joinAfterCreation === true){
        $scope.newEvent.members.push($rootScope.account.userId);
      }
      $scope.newEvent.activity =  $scope.newEvent.activityToProcess.id;
      dataService.addOrUpdateEvent($scope.newEvent)
      .then(function () {
          $scope.getEventsList();
          $scope.updateCalendarContent();
      })
      .catch(function () {
        throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
      });
      angular.element('#newEventPopup').foundation('reveal', 'close');
    };

    $scope.openDetailEvent = function (event) {
      if ($scope.deletePopupButtons === undefined) {
        $scope.deletePopupButtons = [
          {text: "Supprimer", event: "confirmEventDetailDeletePopup", close: true, style: "redButton"},
          {text: "Annuler", event: "", close: true, style: ""}
        ];
        $scope.$on('confirmEventDetailDeletePopup', function () {
          dataService.removeEvent(event).then(function () {
            $scope.getEventsList();
            $scope.updateCalendarContent();
          })
          .catch(function () {
            throw {type: "functional", message: 'Impossible de supprimer l\'événement.'};
          });
        });
      }

      $scope.isUserCreator = event.createdBy === $rootScope.account.userId;
      event.membersDisplay = getMembersToDisplay($scope.benevoles, event);
      $scope.currentDetailEvent = angular.copy(event);
      angular.element('#detailEventPopup').foundation('reveal', 'open');
    };

    $scope.joinEvent = function () {
      if($scope.currentDetailEvent.join === false){
        $scope.currentDetailEvent.members.push($rootScope.account.userId);
      }else{
        var idIndex = $scope.currentDetailEvent.members.indexOf($rootScope.account.userId);
        $scope.currentDetailEvent.members.splice(idIndex, 1);
      }
      $scope.currentDetailEvent.membersDisplay = getMembersToDisplay($scope.benevoles, $scope.currentDetailEvent);
      $scope.detailEventSave(true);
    };

    $scope.detailEventClose = function () {
      angular.element('#detailEventPopup').foundation('reveal', 'close');
    };

    $scope.detailEventSave = function (closePopup) {
      dataService.addOrUpdateEvent($scope.currentDetailEvent)
        .then(function () {
          $scope.getEventsList();
          $scope.updateCalendarContent();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
        });
      if(closePopup === true) {
        angular.element('#detailEventPopup').foundation('reveal', 'close');
      }
    };

    function getEventObjects(events) {
      var eventObjects = [];
      events.forEach(function (event) {
        var formatDate = new Date(event.date);
        formatDate.setHours(event.hour);
        formatDate.setMinutes(event.minute);

        var eventObject = {
          _id:event._id,
          _rev:event._rev,
          title:event.name+' ('+event.members.length+' membre'+(event.members.length > 1 ? 's' : '')+')',
          name:event.name,
          description:event.description,
          startsAt:formatDate,
          date: event.date,
          hour:event.hour,
          minute:event.minute,
          members:event.members,
          incrementsBadgeTotal:true,
          editable: false,
          deletable: false,
          draggable: false,
          resizable: false,
          type: event.type,
          activity: event.activity,
          activityDisplay:activitiesService.getActivityDisplay(event.activity),
          cssClass: 'eventActivity',
          antenneId: event.antenneId,
          join:event.members.indexOf($rootScope.account.userId) !== -1,
          createdBy: event.createdBy
        };
        eventObjects.push(eventObject);
      });
      return eventObjects;
    }

    $scope.getEventsList = function () {
      $scope.events = [];
      dataService.findAllEventsByAntenneIdAndDate($rootScope.account.antenneId)
        .then(function (events) {
          $scope.rawEvents = getEventObjects(events);
          $scope.updateCalendarContent();
        })
        .catch(function () {
          throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
        });
    };

      activate();

    function activate() {
      $scope.showCalendar = $rootScope.account.antenne.features.indexOf("HOMEPAGE_CALENDAR") !== -1;
      if($scope.showCalendar === true) {
        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();
        $scope.updateCurrentMonthDisplay();

        $scope.getActivitiesCurrentUser();

        $scope.getEventsList();

        $scope.benevoles = [];
        dataService.findAllBenevolesByAntenneId($rootScope.account.antenneId)
          .then(function (benevoles) {
            $scope.benevoles = benevoles;
          })
          .catch(function () {
            throw {type: "functional", message: 'Impossible de charger la liste des bénévoles.'};
          });
      }
    }
  }

})();
