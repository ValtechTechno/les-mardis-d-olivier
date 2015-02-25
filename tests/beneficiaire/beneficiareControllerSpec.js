describe("BeneficiaireController", function () {

  var scope;
  var routeParams;

  addBeneficiaireWithCode = function (firstName, lastName, code, card) {
    scope.currentBeneficiaire = {code: code};
    scope.currentBeneficiaire.lastName = lastName;
    scope.currentBeneficiaire.firstName = firstName;
    scope.currentBeneficiaire.hasCard = card === false ? false : true;
    scope.addBeneficiaireFromList();
  };

  addBeneficiaire = function (firstName, lastName) {
    addBeneficiaireWithCode(firstName, lastName, scope.initNextCode());
  };

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(inject(function (dataService) {
    dataService.clear()
  }));
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    routeParams = {};
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireController', {
      $scope: scope,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    scope.resetAddBeneficiareForm();
    scope.currentBeneficiaire = {code: scope.initNextCode()};
  }));

  it('should add a beneficiaire', function () {
    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires).toContain({id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true});
  });

  it('should add a beneficiaire without code', function () {
    addBeneficiaireWithCode('John', 'Rambo', null);

    expect(scope.beneficiaires).toContain({id: '1', code: null, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true});
  });

  it('should add a beneficiaire without card', function () {
    addBeneficiaireWithCode('John', 'Rambo', '1', false);

    expect(scope.beneficiaires).toContain({id: '1', code: '1', firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: false});
  });

  it('calculates the beneficiaire id by incrementing the last id in the list', function () {
    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('Alix', 'Rambo');
    addBeneficiaire('Lana', 'Rambo');

    expect(scope.beneficiaires).toEqual(
      [
        {id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true},
        {id: '2', code: 2, firstName: 'Alix', lastName: 'Rambo', isPresent: false, hasCard: true},
        {id: '3', code: 3, firstName: 'Lana', lastName: 'Rambo', isPresent: false, hasCard: true}
      ]
    );
  });

  it('should prevent the user to add an existing beneficiaire', function () {
    addBeneficiaire('John', 'Rambo');
    try {
      addBeneficiaire('John', 'Rambo');
    }catch (exception){
      expect(exception.type).toBe("functional");
    }
    expect(scope.beneficiaires.length).toBe(1);
  });

  it('should save beneficiaires to dataService', function () {
    addBeneficiaire('foo', 'bar');

    expect(dataService.loadBeneficiaires()).toEqual([{id:'1',code:1,firstName:'foo',lastName:'bar',hasCard:true}]);
  });

});
