(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .filter('DateWithJQueryUiDatePicker', DateWithJQueryUiDatePicker);

  function DateWithJQueryUiDatePicker() {
    return function(input) {
      return $.datepicker.formatDate("DD d MM yy", new Date(input));
    };
  }

})();
