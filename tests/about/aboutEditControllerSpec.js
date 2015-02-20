describe("AboutEditController", function () {

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

  function createController() {
    controller('AboutEditController as aboutEdit', { $scope: scope });
  }

  it('should load about', function () {
    dataService.saveAbout('foobar');

    createController();

    expect(scope.aboutEdit.aboutInformation).toEqual('foobar');
  });

  it('should edit and save', function () {
    createController();

    scope.aboutEdit.aboutInformation = "foo";
    scope.aboutEdit.saveAboutPage();

    expect(scope.aboutEdit.aboutInformation).toEqual("foo");
  });
});
