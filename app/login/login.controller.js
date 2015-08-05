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
      $scope.spinner = {active : true};
      LoginService.login($scope.credentials, function () {
        $scope.spinner = {active : false};
      }, function (error) {
        $scope.spinner = {active : false};
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
