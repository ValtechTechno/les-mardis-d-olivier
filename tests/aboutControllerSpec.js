describe("AboutController", function () {

  var scope;
  var routeParams;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    routeParams = {};
    beneficiairesService = $injector.get('beneficiairesService');

    $controller('AboutController', {
      $scope: scope,
      $filter: $filter,
      beneficiairesService: beneficiairesService
    });
  }));

  it('should manage about page', function () {
    scope.$digest();
    scope.openAboutPage();
    expect(scope.aboutInformation).toEqual(null);
    scope.openAboutPageUpdate();
    scope.aboutInformation = "test";
    scope.saveAboutPage();
    expect(scope.aboutInformation).toEqual("test");
  });
});
