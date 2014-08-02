(function() {
    var app = angular.module('mardisDolivier', []);

    app.controller('contentCtrl', function($scope, Date){
        var today = Date;
        var day = today.getDate().toString();
        var month = (today.getMonth()+1).toString();
        var year = today.getFullYear().toString();
        $scope.distributionDate = (day.length==1?"0"+day:day)+"/"+(month.length==1?"0"+month:month)+"/"+year;
    });

    app.factory('Date',function() {
        return new Date();
    });

})();
