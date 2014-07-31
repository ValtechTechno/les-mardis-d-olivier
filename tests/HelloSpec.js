describe("L'appli s'initialise", function() {

    var scope;//we'll use this scope in our tests

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('mardisDolivier'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        console.log("hello2");
        $controller('contentCtrl', {$scope: scope});
    }));
    // tests start here

    it("j'accède au controller, la distribution date n'est pas vide", function () {
        expect(scope.distributionDate).toBe("");
    })
});
