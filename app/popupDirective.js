(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .directive('popupDirective', function(){
      return {
        restrict:'E',
        scope:{
          popupLabel:'@',
          firstButton:'@',
          firstAction:'&',
          secondButton:'@',
          secondAction:'&'
        },
        templateUrl:'app/popupDirective.html'
      }
    })
})();
