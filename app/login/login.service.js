(function () {
  'use strict';

  angular.module('mardisDolivier')
    .service('Session', Session);

  function Session() {

    this.create = function (pUserId, pUsername, pFullName, pIsAdmin, pAntenneId, pAssociationId, pAntenne, pAdminActivities, pMemberActivities) {
      this.userId = pUserId;
      this.username = pUsername;
      this.fullName = pFullName;
      this.antenneId = pAntenneId;
      this.isAdmin = pIsAdmin;
      this.associationId = pAssociationId;
      this.antenne = pAntenne;
      this.adminActivities = pAdminActivities;
      this.memberActivities = pMemberActivities;
    };

    this.clear = function () {
      this.userId = null;
      this.username = null;
      this.fullName = null;
      this.antenneId = null;
      this.isAdmin = null;
      this.associationId = null;
      this.antenne = null;
      this.adminActivities = null;
      this.memberActivities = null;
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

            if (benevole.rows[0].doc.toValidate === true) {
              throw {type: "functional", message: 'Demande de rattachement en cours de validation par les administrateurs de l\'antenne.'};
            }

            if(benevole.rows[0].doc.antenneId !== undefined) {
              dataService.findAntenneById(benevole.rows[0].doc.antenneId)
                .then(function (antenne) {
                  Session.create(benevole.rows[0].doc._id, benevole.rows[0].doc.email, benevole.rows[0].doc.firstName + " " + benevole.rows[0].doc.lastName, benevole.rows[0].doc.isAdmin,
                    benevole.rows[0].doc.antenneId, benevole.rows[0].doc.associationId, antenne, benevole.rows[0].doc.adminActivities, benevole.rows[0].doc.memberActivities);
                  $rootScope.account = Session;
                  localStorageService.set("session", angular.toJson($rootScope.account));
                  authService.loginConfirmed();
                });
            }else{
              // Join case
              //TODO facto
              Session.create(benevole.rows[0].doc._id, benevole.rows[0].doc.email, benevole.rows[0].doc.firstName + " " + benevole.rows[0].doc.lastName, benevole.rows[0].doc.isAdmin);
              $rootScope.account = Session;
              authService.loginConfirmed();
            }
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
