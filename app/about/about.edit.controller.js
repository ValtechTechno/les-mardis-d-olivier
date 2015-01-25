(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutEditController', AboutEditController);

  function AboutEditController($location) {
    var vm = this;
    vm.aboutInformation = null;
    vm.saveAboutPage = saveAboutPage;

    activate();

    function activate() {
      var aboutFromStorage = angular.fromJson(localStorage.getItem('aboutInformation'));
      if (aboutFromStorage != null) {
        vm.aboutInformation = aboutFromStorage;
      }
    }

    function saveAboutPage() {
      localStorage.setItem('aboutInformation', angular.toJson(vm.aboutInformation));
      $location.path('/about');
    }
  }

})();
