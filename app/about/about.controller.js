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
      dataService.getAboutByAntenneId($rootScope.account.antenneId).then(function(about){
        if(about === null){
          throw {
            type: "functional",
            message: 'Impossible de récupérer les informations.'
          };
        }
        else if(about.length === 0){
          vm.aboutInformation = undefined;
        }
        else if(about.length === 1){
          vm.aboutInformation = about[0].doc;
        }
      });
    }
  }

})();
