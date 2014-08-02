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
            if (firstName === undefined || firstName.length == 0) {
                return;
            }
            if (lastName === undefined || lastName.length == 0) {
                return;
            }
            $scope.beneficiaires.push({firstName:firstName, lastName:lastName});
        };
        $scope.beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
        if ($scope.beneficiaires === null) {
            $scope.beneficiaires = [];
        }
        $scope.$watch('beneficiaires', function(newValue, oldValue) {
            localStorage.setItem('beneficiaires', angular.toJson($scope.beneficiaires));
        }, true);
    });

    app.factory('Date',function() {
        return new Date();
    });

})();
