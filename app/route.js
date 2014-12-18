(function() {
  'use strict';

  var app = angular.module('mardisDolivier');

  app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
          controller: 'contentCtrl',
          templateUrl: 'app/view.html'
        });
  });

})();
