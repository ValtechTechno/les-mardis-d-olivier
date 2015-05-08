describe("AboutEditController", function () {

  var scope;
  var controller;
  var dataService;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(inject(function (dataService) {
    dataService.clear();
  }));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $injector) {
    scope = $rootScope.$new();
    controller = $controller;
    dataService = $injector.get('dataService');
    var deferred = _$q_.defer();
    deferred.resolve({content:"foobar", _rev:"1"});
    spyOn(dataService, 'saveAbout').andReturn(deferred.promise);
  }));

  function createController() {
    controller('AboutEditController as aboutEdit', { $scope: scope });
  }

  it('should edit and save', function () {
    createController();

    scope.aboutEdit.aboutInformation = {content : "foo"};
    scope.aboutEdit.saveAboutPage();
    scope.$apply();

    expect(scope.aboutEdit.aboutInformation._rev).toEqual("1");
    expect(scope.aboutEdit.aboutInformation.content).toEqual("foobar");
  });
});
