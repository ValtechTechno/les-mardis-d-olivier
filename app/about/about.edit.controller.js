(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutEditController', AboutEditController);

  function AboutEditController($location, dataService) {
    var vm = this;
    vm.aboutInformation = null;
    vm.saveAboutPage = saveAboutPage;

    activate();

    function activate() {
      vm.aboutInformation = dataService.about();
    }

    function saveAboutPage() {
      dataService.saveAbout(vm.aboutInformation);
      $location.path('/about');
    }
  }

})();
