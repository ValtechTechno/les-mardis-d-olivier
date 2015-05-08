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
      dataService.about().then(function(about){
        vm.aboutInformation = about;
      });
    }

    function saveAboutPage() {
      dataService.saveAbout(vm.aboutInformation).then(function(about) {
        vm.aboutInformation = about;
        $location.path('/about');
      }).catch(function (err) {
      });
    }
  }

})();
