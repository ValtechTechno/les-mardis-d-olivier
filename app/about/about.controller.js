(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('AboutController', AboutController);

  function AboutController(dataService, $rootScope) {
    var vm = this;
    vm.aboutInformation = null;

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
  }

})();
