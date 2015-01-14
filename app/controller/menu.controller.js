(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('MenuController', function ($scope, $location) {

    $scope.isActive = function (path) {
      if ($location.path().substr(0, path.length) == path) {
        return "active"
      } else {
        return ""
      }
    };

  });
})();
