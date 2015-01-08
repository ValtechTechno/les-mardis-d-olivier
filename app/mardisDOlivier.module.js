(function () {
  'use strict';

})();

'use strict';

/* App Module */

var mardisDolivier = angular.module('mardisDolivier', ['ui.date', 'ngRoute']);

mardisDolivier.run(function ($location) {
  $location.path("/distribution");
});

