describe("BeneficiaireController", function () {

  var scope;
  var routeParams;

  addBeneficiaireWithCode = function (firstName, lastName, code) {
    scope.currentBeneficiaire = {code: code};
    scope.currentBeneficiaire.lastName = lastName;
    scope.currentBeneficiaire.firstName = firstName;
    scope.addBeneficiaireFromList();
  };

  addBeneficiaire = function (firstName, lastName) {
    addBeneficiaireWithCode(firstName, lastName, scope.initNextCode());
  };


  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    routeParams = {};
    beneficiairesService = $injector.get('beneficiairesService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireController', {
      $scope: scope,
      $filter: $filter,
      beneficiairesService: beneficiairesService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    scope.resetAddBeneficiareForm();
    scope.currentBeneficiaire = {code: scope.initNextCode()};
  }));

  it('should add a beneficiaire', function () {

    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires).toContain({id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false});
  });

  it('should add a beneficiaire without code', function () {
    addBeneficiaireWithCode('John', 'Rambo', null);

    expect(scope.beneficiaires).toContain({id: '1', code: null, firstName: 'John', lastName: 'Rambo', isPresent: false});
  });

  it('calculates the beneficiaire id by incrementing the last id in the list', function () {

    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('Alix', 'Rambo');
    addBeneficiaire('Lana', 'Rambo');

    expect(scope.beneficiaires).toEqual(
      [
        {id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false},
        {id: '2', code: 2, firstName: 'Alix', lastName: 'Rambo', isPresent: false},
        {id: '3', code: 3, firstName: 'Lana', lastName: 'Rambo', isPresent: false}
      ]
    );
  });

  it('should prevent the user to add an existing beneficiaire', function () {

    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires.length).toBe(1);
    expect(scope.currentError.isBeneficiaireNotUnique).toBe(true);
  });

  it('should prevent the user to add an existing id for beneficiaire', function () {

    addBeneficiaireWithCode('John', 'Rambo', '1');
    addBeneficiaireWithCode('Michel', 'Rambo', '1');

    expect(scope.beneficiaires.length).toBe(1);
    expect(scope.currentError.isCodeNotUnique).toBe(true);
  });

  it('should not allow to add a beneficiaire with empty first name or last name', function () {

    addBeneficiaire('', '');
    addBeneficiaire('John', '');
    addBeneficiaire('', 'Rambo');

    expect(scope.beneficiaires.length).toBe(0);
  });

  it('should save beneficiaires to localStorage', function () {
    scope.$digest();
    addBeneficiaire('foo', 'bar');
    scope.$digest();
    scope.$apply();
    expect(localStorage.getItem('beneficiaires')).toBe('[{"id":"1","code":1,"firstName":"foo","lastName":"bar"}]');
  });

});
