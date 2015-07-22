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
      dataService.getAboutByAntenneId($rootScope.account.antenneId).then(function(about){
        if(about === undefined){
          throw {
            type: "functional",
            message: 'Impossible de récupérer les informations.'
          };
        }
        vm.aboutInformation = about;
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
