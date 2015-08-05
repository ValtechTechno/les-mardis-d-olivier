(function () {
  'use strict';

  angular.module('mardisDolivier', ['ui.date', 'ngRoute', 'ngAnimate', 'toaster', 'pascalprecht.translate', 'ngMessages', 'http-auth-interceptor', 'LocalStorageModule', 'angular-uuid', 'treasure-overlay-spinner']);

  angular
    .module('mardisDolivier')
    .run(function ($rootScope, $location, LoginService, Session) {

      var loginPath = '/login';

      $rootScope.$on('$routeChangeStart', function () {
        if($location.path().indexOf('noauth') === -1) {
          $rootScope.isAuthorized = LoginService.isAuthorized;
          LoginService.valid(undefined);
        }
      });

      // Call when the the client is confirmed
      $rootScope.$on('event:auth-loginConfirmed', function (/*data*/) {
        $rootScope.authenticated = true;
        $rootScope.account = Session;
        if ($location.path().substr(0, loginPath.length) === loginPath) {
          var search = $location.search();
          if (search.redirect !== undefined) {
            $location.path(search.redirect).search('redirect', null).replace();
          } else {
            $location.path('/').replace();
          }
        }
      });

      // Call when the 401 response is returned by the server
      $rootScope.$on('event:auth-loginRequired', function (/*rejection*/) {
        $rootScope.authenticated = false;

        if($location.path().indexOf('noauth') !== -1){
          return true;
        }

        if ($location.path().substr(0, loginPath.length) !== loginPath && $location.path() !== '') {
          var redirect = $location.path();
          $location.path(loginPath).search('redirect', redirect).replace();
        }
      });

      // Call when the 403 response is returned by the server
      $rootScope.$on('event:auth-forbidden', function (rejection) {
        $rootScope.errorMessage = rejection;
        $location.path('/error').replace();
      });

      // Call when the user logs out
      $rootScope.$on('event:auth-loginCancelled', function () {
        $rootScope.authenticated = false;
        $rootScope.errorMessage = null;
        Session.clear();
        $rootScope.account = null;
        $location.path('');
      });

    });

})();

