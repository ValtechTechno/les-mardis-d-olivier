describe("AboutController", function () {

  var scope;
  var controller;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller;
  }));

  function createController(){
    controller('AboutController as about', { $scope: scope });
  }

  it('with no about information', function () {
    createController();

    expect(scope.about.aboutInformation).toEqual(null);
  });

  it('with any about information', function () {
    localStorage.setItem('aboutInformation', angular.toJson("foobar"));

    createController();

    expect(scope.about.aboutInformation).toEqual("foobar");
  });
});
