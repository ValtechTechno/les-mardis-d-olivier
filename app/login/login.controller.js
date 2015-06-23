(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('LoginController', LoginController);

  function LoginController($scope, LoginService) {

    $scope.initForm = function () {
      $scope.credentials = {login: '', password: ''};
    };

    $scope.login = function () {
      var isLoginPresent = $scope.credentials.login.length > 0;
      var isPasswordPresent = $scope.credentials.password.length > 0;
      if (!isLoginPresent && !isPasswordPresent) {
        throw {type: "functional", message: 'Veuillez renseigner votre email et mot de passe'};
      } else if (!isLoginPresent && isPasswordPresent) {
        throw {type: "functional", message: 'Veuillez renseigner votre email.'};
      } else if (isLoginPresent && !isPasswordPresent) {
        throw {type: "functional", message: 'Veuillez renseigner votre mot de passe.'};
      }
      LoginService.login($scope.credentials, function () {

      }, function (errorType) {
        if (errorType === 'WRONG_LOGIN') {
          throw {type: "functional", message: 'Mauvais email.'};
        }
        else if (errorType === 'MULTIPLE_LOGIN') {
          throw {type: "functional", message: 'Plusieurs utilisateurs utilisent cet email.'};
        }
        else if (errorType === 'WRONG_PASSWORD') {
          throw {type: "functional", message: 'Mauvais mot de passe.'};
        }
        else {
          throw {type: "functional", message: 'Impossible de se connecter.'};
        }
      });
    };

    function activate() {
      $scope.initForm();
    }

    activate();
  }
})();
