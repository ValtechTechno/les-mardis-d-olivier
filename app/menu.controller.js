(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('MenuController', MenuController);

  function MenuController($location, $rootScope, $timeout) {
    var vm = this;
    vm.isActive = isActive;
    vm.removeErrorMessage = removeErrorMessage;
    vm.maxErrorToShow = 1;
    vm.currentErrorTimeout;
    function isActive(path) {
      if ($location.path().substr(0, path.length) == path) {
        return "active";
      }
      return "";
    }

    function removeErrorMessage(indexErrorMessage) {
      $rootScope.currentErrors.splice(indexErrorMessage, 1);
    }

    $rootScope.$on('$routeChangeSuccess', function () {
      $rootScope.currentErrors = [];
    });

    $rootScope.$on('handleCurrentErrors', function (dunno, exception) {

      if ( $rootScope.currentErrors.length >= vm.maxErrorToShow) {
        $rootScope.currentErrors = [];
      }

      if (!vm.currentErrorTimeout && $rootScope.currentErrors.length == 0) {
        vm.currentErrorTimeout = $timeout(function () {
          $rootScope.currentErrors.push({errorMessage: exception.message});
          vm.currentErrorTimeout = undefined;
        }, 1000);
      }

    });

  }
})();
