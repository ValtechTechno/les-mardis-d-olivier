describe("AboutController", function () {

  var scope;
  var controller;
  var dataService;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(inject(function (dataService) {
    dataService.clear();
  }));
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $injector) {
    scope = $rootScope.$new();
    controller = $controller;
    dataService = $injector.get('dataService');
  }));

  function createController(){
    controller('AboutController as about', { $scope: scope });
  }

  it('with no about information', function () {
    createController();

    expect(scope.about.aboutInformation).toEqual(null);
  });

  it('with any about information', function () {
    dataService.saveAbout("foobar");

    createController();

    expect(scope.about.aboutInformation).toEqual("foobar");
  });
});
