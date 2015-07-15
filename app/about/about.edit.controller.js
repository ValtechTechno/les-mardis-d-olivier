(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutEditController', AboutEditController);

  function AboutEditController($location, dataService, $rootScope) {
    var vm = this;
    vm.aboutInformation = null;
    vm.saveAboutPage = saveAboutPage;

    activate();

    function activate() {
      dataService.getAboutByAntenneId($rootScope.account.antenneId).then(function(abouts){
        if(abouts.length > 1){
          throw {
            type: "functional",
            message: 'Impossible de récupérer les informations.'
          };
        }
        if(abouts.length === 1) {
          vm.aboutInformation = abouts[0].doc;
        }
      });
    }

    function saveAboutPage() {
      if(vm.aboutInformation.antenneId === undefined){
        vm.aboutInformation.antenneId = $rootScope.account.antenneId;
      }
      dataService.updateAbout(vm.aboutInformation).then(function() {
        $location.path('/about');
      }).catch(function () {
        throw {
          type: "functional",
          message: 'Une erreur est survenue lors de l\'enregistrement. Veuillez recommencer.'
        };
      });
    }
  }

})();
