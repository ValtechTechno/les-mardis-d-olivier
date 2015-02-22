(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .factory('$exceptionHandler', function ($injector) {
      return function (exception) {
        if (exception.type != "functional" || !exception.message) {
          throw exception;
        }
        var $rootScope = $injector.get("$rootScope");
        $rootScope.$emit("handleCurrentErrors", exception);
      };
    });
})();
