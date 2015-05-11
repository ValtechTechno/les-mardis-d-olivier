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
      dataService.getAbout().then(function(about){
        vm.aboutInformation = about;
      });
    }

    function saveAboutPage() {
      dataService.updateAbout(vm.aboutInformation).then(function() {
        $location.path('/about');
      }).catch(function (err) {
      });
    }
  }

})();
