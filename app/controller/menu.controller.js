(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('MenuController', MenuController);

  function MenuController ($scope, $location) {

    $scope.isActive = function (path) {
      if ($location.path().substr(0, path.length) == path) {
        return "active"
      }
      return ""
    };

  }
})();
