(function () {
  'use strict';

  angular.module('mardisDolivier')
    .service('Session', Session);

  function Session() {

    this.create = function (pUserId, pUsername, pFullName, pIsAdmin, pAntenneId, pAssociationId) {
      this.userId = pUserId;
      this.username = pUsername;
      this.fullName = pFullName;
      this.antenneId = pAntenneId;
      this.isAdmin = pIsAdmin;
      this.associationId = pAssociationId;
    };

    this.clear = function () {
      this.userId = null;
      this.username = null;
      this.fullName = null;
      this.antenneId = null;
      this.isAdmin = null;
      this.associationId = null;
    };

    return this;
  }


  angular.module('mardisDolivier')
    .factory('LoginService', LoginService);


  function LoginService(Session, authService, $rootScope, dataService, localStorageService, $location) {

    return {

      login: function (credentials, successCallback, errorCallback) {
        dataService.login(credentials.login)
          .then(function (benevole) {
            if (benevole === null || benevole.rows.length === 0) {
              throw {type: "functional", message: 'Mauvais email.'};
            } else if (benevole.rows.length > 1) {
              throw {type: "functional", message: 'Plusieurs utilisateurs utilisent cet email.'};
            }

            if (benevole.rows[0].doc.password !== CryptoJS.SHA256(credentials.password).toString()) {
              throw {type: "functional", message: 'Mauvais mot de passe.'};
            }

            Session.create(benevole.rows[0].doc._id, benevole.rows[0].doc.email, benevole.rows[0].doc.firstName + " " + benevole.rows[0].doc.lastName, benevole.rows[0].doc.isAdmin, benevole.rows[0].doc.antenneId, benevole.rows[0].doc.associationId);
            $rootScope.account = Session;
            localStorageService.set("session", angular.toJson($rootScope.account));
            authService.loginConfirmed();

            if (successCallback !== undefined) {
              successCallback(benevole);
            }
          })
          .catch(function (err) {
            if (errorCallback !== undefined) {
              errorCallback(err);
            }
          });
      },

      valid: function (authorizedRoles) {

        if ($rootScope.account === undefined || $rootScope.account === null) {
          var lsSession = angular.fromJson(localStorageService.get('session'));
          if (lsSession !== undefined && lsSession !== null) {
            $rootScope.account = lsSession;
          }
        }

        if ($rootScope.account !== undefined && $rootScope.account !== null) {
          $rootScope.authenticated = true;
          if ($rootScope.account.antenneId === undefined && $rootScope.account.associationId === undefined) {
            $location.path('/join');
            return false;
          } else {
            return true
          }
        }

        $rootScope.authenticated = false;
        localStorageService.set("session", null);

        if (!$rootScope.isAuthorized(authorizedRoles)) {
          $rootScope.$broadcast('event:auth-loginRequired');
        }
      },

      saveSessionCookie: function () {
        localStorageService.set("session", angular.toJson($rootScope.account));
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
