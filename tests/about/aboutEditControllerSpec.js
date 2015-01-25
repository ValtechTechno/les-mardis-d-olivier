describe("AboutEditController", function () {

  var scope;
  var controller;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $location) {
    scope = $rootScope.$new();
    controller = $controller;
  }));

  function createController() {
    controller('AboutEditController as aboutEdit', { $scope: scope });
  }

  it('should load about', function () {
    localStorage.setItem('aboutInformation', angular.toJson('foobar'));

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
