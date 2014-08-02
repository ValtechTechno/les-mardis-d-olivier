(function() {
    var app = angular.module('mardisDolivier', []);

    app.controller('contentCtrl', function($scope, $filter, Date) {
        var today = Date;
        $scope.distributionDate = $filter('date')(today, 'dd/MM/yyyy');
    });

    app.factory('Date',function() {
        return new Date();
    });

})();
