(function () {
    'use strict';

    angular.module('mardisDolivier')
        .service('Session', Session);

    function Session() {

        this.create = function (pUserId, pUsername, pfullName, pRoles, pUserType) {
            this.userId = pUserId;
            this.username = pUsername;
            this.fullName = pfullName;
//            this.roles = pRoles;
//            this.userType = pUserType;
        };

        this.clear = function () {
            this.userId = null;
            this.username = null;
            this.fullName = null;
//            this.roles = null;
//            this.userType = null;
        };

        return this;
    }


    angular.module('mardisDolivier')
        .factory('LoginService', LoginService);


    function LoginService(Session, authService, $rootScope, dataService, localStorageService) {

        return {

            login: function (credentials, successCallback, errorCallback) {
              dataService.login(credentials.login)
              .then(function (data) {
                  if(data === null || data.rows.length === 0){
                    throw 'WRONG_LOGIN';
                  }else if(data.rows.length > 1){
                    throw 'MULTIPLE_LOGIN';
                  }
                  if(data.rows[0].doc.password !== credentials.password){
                    throw 'WRONG_PASSWORD';
                  }
                  Session.create(data.rows[0].doc._id, data.rows[0].doc.email, data.rows[0].doc.firstName+" "+data.rows[0].doc.lastName, null, null);//data.roles, data.userType);
                  $rootScope.account = Session;
                  localStorageService.set("session", angular.toJson($rootScope.account));
                  authService.loginConfirmed();
                  if (successCallback !== undefined) {
                    successCallback(data);
                  }
              })
              .catch(function (err) {
                  if (errorCallback !== undefined) {
                    errorCallback(err);
                  }
              });
            },

            isAuthenticated: function () {
                return !!Session.username;
            },

            valid: function (authorizedRoles) {

              var lsSession = angular.fromJson(localStorageService.get('session'));
              if($rootScope.account !== undefined && $rootScope.account !== null){
                $rootScope.authenticated = true;
                return true;
              }
              else if(lsSession !== null){
                $rootScope.account = lsSession;
                $rootScope.authenticated = true;
                return true;
              }
              $rootScope.authenticated = false;
              localStorageService.set("session", null);

              if (!$rootScope.isAuthorized(authorizedRoles)) {
                  $rootScope.$broadcast('event:auth-loginRequired');
              }
            },

            isAuthorized: function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) { // all
                    if (authorizedRoles === '*') {
                        return true;
                    }

                    authorizedRoles = [authorizedRoles]; //array
                }

                var isAuthorized = false;
                angular.forEach(authorizedRoles, function (authorizedRole) {
                    var authorized = (!!Session.username &&
                    Session.roles.indexOf(authorizedRole) !== -1);

                    if (authorized || authorizedRole === '*') {
                        isAuthorized = true;
                    }
                });

                return isAuthorized;
            },
            logout: function () {
              localStorageService.set("session", null);
              authService.loginCancelled();
            }
        };
    }
})();
