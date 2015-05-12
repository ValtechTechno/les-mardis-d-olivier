(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('MenuController', MenuController);

  function MenuController($location) {
    var vm = this;
    vm.isActive = isActive;
    function isActive(path) {
      if ($location.path().substr(0, path.length) == path) {
        return "active";
      }
      return "";
    }

  }
})();
