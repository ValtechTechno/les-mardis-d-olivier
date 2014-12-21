(function() {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('MenuController', MenuController);

  function MenuController() {
    var vm = this;
    vm.currentPage = { distributionList : true };
  }

})();
