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
        if(about === undefined){
          throw {
            type: "functional",
            message: 'Impossible de récupérer les informations.'
          };
        }
          vm.aboutInformation = about;
      });
    }
  }

})();
