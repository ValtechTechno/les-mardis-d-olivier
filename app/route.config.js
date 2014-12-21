(function() {
  'use strict';

  angular
      .module('mardisDolivier')
      .config(route);

  function route($routeProvider) {
    $routeProvider
        .when('/', {
          controller: 'ContentController',
          templateUrl: 'app/view.html'
        });
  }

})();
