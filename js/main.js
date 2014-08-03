(function() {
    if(typeof localStorage=='undefined') {
        alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
    }

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

        $scope.showAllDistribution = function(){
            $scope.distributions = retrieveAllDistribution();
        };
        $scope.showAllDistribution();

        $scope.startNewDistribution = function(){
            $scope.saveNewDistribution();
            $scope.showAllDistribution();
            $scope.distributionStarted = true;
        };

        $scope.saveNewDistribution = function(){
            storeDistribution({
                "date":$scope.distributionDate,
                "nbPlannedMeals":$scope.distributionNbPlannedMeals
            });
        };
    });

    app.factory('Date',function() {
        return new Date();
    });

})();

retrieveAllDistribution = function(){
    var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
    if (allDistributions == null){
        allDistributions = [];
    }else{
        allDistributions.reverse();
    }
    return allDistributions;
}

storeDistribution = function(distribution){
    var distributions = angular.fromJson(localStorage.getItem('distributions'));
    if (distributions==null){
        distributions = [];
    }
    distributions.push(distribution);
    localStorage.setItem('distributions',angular.toJson(distributions));
}