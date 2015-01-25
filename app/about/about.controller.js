(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutController', AboutController);

  function AboutController() {
    var vm = this;
    vm.aboutInformation = null;

    activate();

    function activate() {
      var aboutFromStorage = angular.fromJson(localStorage.getItem('aboutInformation'));
      if (aboutFromStorage != null) {
        vm.aboutInformation = aboutFromStorage;
      }
    }
  }

})();
