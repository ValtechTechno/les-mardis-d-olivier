(function() {
    var app = angular.module('mardisDolivier', []);

    app.controller('contentCtrl', function($scope, $filter, Date) {
        var today = Date;
        $scope.distributionDate = $filter('date')(today, 'dd/MM/yyyy');
        $scope.addBeneficiaire = function(firstName, lastName) {
            if ($scope.beneficiaires.filter(function (beneficiaire) {
                return beneficiaire.firstName === firstName && beneficiaire.lastName === lastName;
            }).length > 0) {
                return;
            }
            $scope.beneficiaires.push({firstName:firstName, lastName:lastName});
        };
            $scope.beneficiaires = [];
    });

    app.factory('Date',function() {
        return new Date();
    });

})();
