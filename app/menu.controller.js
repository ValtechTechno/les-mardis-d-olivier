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
    vm.isAdmin = isAdmin;
    vm.isResp = isResp;
    vm.isLink = isLink;
    vm.isUserNotAuth = isUserNotAuth;
    vm.isUserNotLink = isUserNotLink;
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

    function isResp(){
      return $rootScope.account !== undefined && $rootScope.account !== null && $rootScope.account.adminActivities !== undefined &&  $rootScope.account.adminActivities !== null &&  $rootScope.account.adminActivities.length > 0;v
    }

    function isAdmin(){
      return $rootScope.account !== null && $rootScope.account !== undefined && $rootScope.account.isAdmin === true;
    }

    function isLink(){
      return !vm.isUserNotLink();
    }

    function isUserNotAuth(){
      return $rootScope.account === null || $rootScope.account === undefined || $rootScope.account.antenneId === undefined || $rootScope.account.associationId === undefined;
    }

    function isUserNotLink(){
      return $rootScope.account !== null && $rootScope.account !== undefined && $rootScope.account.antenneId === undefined && $rootScope.account.associationId === undefined;
    }

  }

})();
