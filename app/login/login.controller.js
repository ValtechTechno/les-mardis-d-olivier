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

      }, function (error) {
        if(error.type !== "functional"){
          throw error;
        }
      });
    };

    function activate() {
      $scope.initForm();
    }

    activate();
  }
})();
