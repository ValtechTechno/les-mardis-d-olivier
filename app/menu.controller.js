(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('MenuController', MenuController);

  function MenuController($location, LoginService, $rootScope) {
    var vm = this;
    vm.isActive = isActive;
    vm.logout = logout;
    vm.isAuth = isAuth;
    vm.isUserNotAuth = isUserNotAuth;
    function isActive(path) {
      if ($location.path().substr(0, path.length) === path) {
        return true;
      }
      return false;
    }

    function logout(){
      LoginService.logout();
      $location.path("/login");
    }

    function isAuth(){
      return !vm.isUserNotAuth();
    }

    function isUserNotAuth(){
      return $rootScope.account === null || $rootScope.account === undefined;
    }

  }
})();
