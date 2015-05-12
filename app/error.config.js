(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .factory('$exceptionHandler', function ($injector) {
      return function (exception) {
        if (exception.type != "functional" || !exception.message) {
          throw exception;
        }
        var toaster = $injector.get("toaster");
        toaster.pop('error', null, exception.message);
      };
    });
})();
