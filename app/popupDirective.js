(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .directive('popupDirective', function () {
      var id = 1;
      return {
        restrict: 'E',
        scope: {
          buttonLabel: '@',
          popupLabel: '@',
          popupButton: '=',
          event: '@',
          style: "@"
        },
        link: function (scope, element, attrs) {
          scope.popupDirectiveId = 'popupDirective' + id++;
          element.find('div').attr('id', scope.popupDirectiveId);
          scope.openPopup = function () {
            $('#' + scope.popupDirectiveId).foundation('reveal', 'open');
          };
          scope.action = function () {
            if (this.button.close === true) {
              $('#' + scope.popupDirectiveId).foundation('reveal', 'close');
            }
            if (this.button.event) {
              scope.$emit(this.button.event);
            }
          };
        },
        templateUrl: 'app/popupDirective.html'
      };
    });
})();
