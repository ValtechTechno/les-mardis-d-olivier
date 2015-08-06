(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('HomepageController', HomepageController);

  function HomepageController($scope) {

    function getCurrentMonthDisplay(date){
      var rawDate = $.datepicker.formatDate("MM", date);
      return rawDate.substr(0, 1).toUpperCase() + rawDate.substr(1);
    }

    $scope.updateCurrentMonth = function(){
      $scope.currentMonthDisplayed = getCurrentMonthDisplay($scope.calendarDay);
    };

    activate();

    function activate() {
      $scope.calendarView = 'month';
      $scope.calendarDay = new Date();
      $scope.updateCurrentMonth();
      // TODO test data for demo
      $scope.events = [
        {
          title: 'Nom1 Prénom1', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,1,1), // A javascript date object for when the event starts
          //endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom2 Prénom2', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },{
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },

        {
          title: 'Nom3 Prénom3', // The title of the event
          type: 'important', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,10,1), // A javascript date object for when the event starts
          //endsAt: new Date(2015,8,11,1), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        },
        {
          title: 'My event title 2', // The title of the event
          type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
          startsAt: new Date(2015,7,15,1), // A javascript date object for when the event starts
          //endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
          editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
          deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
          draggable: false, //Allow an event to be dragged and dropped
          resizable: false, //Allow an event to be resizable
          incrementsBadgeTotal: false, //If set to false then will not count towards the badge total amount on the month and year view
          //recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
          cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
        }
      ];
    }
  }

})();
