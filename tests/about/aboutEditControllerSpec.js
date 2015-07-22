describe("AboutEditController", function () {

  var scope;
  var controller;
  var dataService;
  var deferredGet,deferredPut;
  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $injector) {
    scope = $rootScope.$new();
    $rootScope.account = {antenneId : 1};
    controller = $controller;
    dataService = $injector.get('dataService');
    deferredGet = _$q_.defer();
    deferredPut = _$q_.defer();
  }));

  function createController() {
    controller('AboutEditController as aboutEdit', { $scope: scope });
  }

  it('should edit and save', function () {
    deferredGet.resolve({content:"foobar"});
    spyOn(dataService, 'getAboutByAntenneId').andReturn(deferredGet.promise);
    spyOn(dataService, 'updateAbout').andReturn(deferredPut.promise);

    createController();
    scope.$apply();

    scope.aboutEdit.aboutInformation = {content : "foo"};

    scope.aboutEdit.saveAboutPage();
    scope.$apply();

    expect(dataService.updateAbout).toHaveBeenCalledWith(scope.aboutEdit.aboutInformation);
  });
});
