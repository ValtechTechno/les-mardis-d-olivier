(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('MenuController', MenuController);

  function MenuController($location, LoginService, $rootScope, $translate) {
    var vm = this;
    vm.isActive = isActive;
    vm.logout = logout;
    vm.isAuth = isAuth;
    vm.isAdmin = isAdmin;
    vm.isResp = isResp;
    vm.isLink = isLink;
    vm.isSingleActivity = isSingleActivity;
    vm.getSingleActivityName = getSingleActivityName;
    vm.hasNoActivity = hasNoActivity;
    vm.isUserNotAuth = isUserNotAuth;
    vm.isUserNotLink = isUserNotLink;
    vm.hasFeature = hasFeature;
    function isActive(path) {
      return $location.path().substr(0, path.length) === path;
    }

    function logout(){
      LoginService.logout();
    }

    function hasFeature(feature){
        return $rootScope.account !== undefined && $rootScope.account !== null && $rootScope.account.antenne !== null && $rootScope.account.antenne !== undefined && $rootScope.account.antenne.features !== undefined && $rootScope.account.antenne.features.indexOf(feature) !== -1;
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

    function isSingleActivity(){
      return $rootScope.account !== undefined && $rootScope.account !== null && $rootScope.account.antenne !== null && $rootScope.account.antenne !== undefined && $rootScope.account.antenne.activities !== undefined && $rootScope.account.antenne.activities.length === 1;
    }

    function hasNoActivity(){
      return $rootScope.account !== undefined && $rootScope.account !== null && $rootScope.account.antenne !== null && $rootScope.account.antenne !== undefined && ($rootScope.account.antenne.activities === undefined || ($rootScope.account.antenne.activities !== undefined && $rootScope.account.antenne.activities.length === 0));
    }

    function getSingleActivityName(){
      return isSingleActivity() === true ? $translate.instant('lang.'+$rootScope.account.antenne.activities[0]) : '';
    }

  }

})();
