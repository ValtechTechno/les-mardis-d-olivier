describe('Initialisation check', function() {

    var scope;

    beforeEach(angular.mock.module('mardisDolivier'));
    beforeEach(function() {
        localStorage.clear()
    });
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

    it('should save beneficiaires to localStorage', function () {
        scope.addBeneficiaire('foo', 'bar');
        scope.$digest();

        expect(localStorage.getItem('beneficiaires')).toBe('[{"firstName":"foo","lastName":"bar"}]');
    });

    it("is is possible to save a new distribution", function () {
        scope.distributionNbPlannedMeals = "50";
        scope.distributionDate = "12/12/2012"
        scope.saveNewDistribution();
        expect(retrieveAllDistribution()).toEqual([{"date":"12/12/2012", "nbPlannedMeals":"50"}]);
    });

    it("shouldn't be possible to save two distribution at the same date", function () {
        scope.distributionNbPlannedMeals = "50";
        scope.distributionDate = "12/12/2012"
        scope.saveNewDistribution();
        try{scope.saveNewDistribution();}catch(err){}
        expect(retrieveAllDistribution()).toEqual([{"date":"12/12/2012", "nbPlannedMeals":"50"}]);
    })

    it('should not allow to add a distribution with empty date or number of meals', function () {
        scope.distributionNbPlannedMeals = "";
        scope.distributionDate = ""
        try{scope.saveNewDistribution();}catch(err){}
        scope.distributionNbPlannedMeals = "50";
        scope.distributionDate = ""
        try{scope.saveNewDistribution();}catch(err){}
        scope.distributionNbPlannedMeals = "";
        scope.distributionDate = "12/12/2012"
        try{scope.saveNewDistribution();}catch(err){}
        expect(retrieveAllDistribution()).toEqual([]);
    });
});
