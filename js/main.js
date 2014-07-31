(function() {
    var app = angular.module('mardisDolivier', []);

    app.controller('contentCtrl', function($scope, Date){
        var today = Date;
        var day = today.getDate().toString();
        var month = (today.getMonth()+1).toString();
        var year = today.getFullYear().toString();
        $scope.distributionDate = (day.length==1?"0"+day:day)+"/"+(month.length==1?"0"+month:month)+"/"+year;
    });

    app.factory('Date',function(){
        Date.prototype.yyyymmdd = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
            var dd  = this.getDate().toString();
            return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
        };
        return new Date();
    });

})();
