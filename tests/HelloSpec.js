describe('Initialisation check', function() {

    var scope;

    beforeEach(angular.mock.module('mardisDolivier'));
    beforeEach(angular.mock.inject(function($rootScope, $controller, $filter){
        scope = $rootScope.$new();
        $controller('contentCtrl', {
            $scope: scope,
            $filter: $filter,
            Date: new Date(1981, 11, 24)
        });
    }));
    
    it('should have the date defined', function () {
        expect(scope.distributionDate).toBe('24/12/1981');
    });
});
