(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutController', AboutController);

  function AboutController(dataService) {
    var vm = this;
    vm.aboutInformation = null;

    activate();

    function activate() {
      vm.aboutInformation = dataService.about();
    }
  }

})();
