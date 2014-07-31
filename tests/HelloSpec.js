describe("L'appli s'initialise", function() {

    var scope;//we'll use this scope in our tests

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('mardisDolivier'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        $controller('contentCtrl', {
            $scope: scope,
            Date: new Date(1981, 11, 24)
        });
        //declare the controller and inject our empty scope
        console.log("hello2");
    }));
    
    it("the date should be defined.", function () {
        expect(scope.distributionDate).toBe("24/12/1981");
    // tests start here

    })
});
