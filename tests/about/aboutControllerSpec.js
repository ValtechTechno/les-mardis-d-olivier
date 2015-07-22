describe("AboutController", function () {

  var scope;
  var controller;
  var dataService;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $injector) {
    scope = $rootScope.$new();
    $rootScope.account = {antenneId : 1};
    controller = $controller;
    dataService = $injector.get('dataService');
    var deferred = _$q_.defer();
    deferred.resolve({content:"foobar"});
    spyOn(dataService, 'getAboutByAntenneId').andReturn(deferred.promise);
  }));

  function createController(){
    controller('AboutController as about', { $scope: scope });
  }

  it('with no about information', function () {
    createController();
    expect(scope.about.aboutInformation).toEqual(null);
  });

  it('with any about information', function () {
    createController();
    scope.$apply();
    expect(scope.about.aboutInformation.content).toEqual("foobar");
  });
});
