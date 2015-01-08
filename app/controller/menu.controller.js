(function () {
  'use strict';

  mardisDolivier.controller('MenuController', function ($scope, $filter, beneficiairesService, $location) {
    // to highlight item menu
    $scope.isActive = function (path) {
      if ($location.path().substr(0, path.length) == path) {
        return "active"
      } else {
        return ""
      }
    };
  })
})();
