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

    it('should add a beneficiaire', function () {
        scope.addBeneficiaire('John', 'Rambo');

        expect(scope.beneficiaires).toContain({firstName:'John',lastName:'Rambo'});
    });

    it('should not allow to add an existing beneficiaire', function () {
        scope.beneficiaires.push({firstName:'John',lastName:'Rambo'});

        scope.addBeneficiaire('John', 'Rambo');

        expect(scope.beneficiaires.length).toBe(1);
    });

    it('should not allow to add a beneficiaire with empty first name or last name', function () {
        scope.addBeneficiaire('', '');
        scope.addBeneficiaire('John', '');
        scope.addBeneficiaire('', 'Rambo');

        expect(scope.beneficiaires.length).toBe(0);
    });
});
