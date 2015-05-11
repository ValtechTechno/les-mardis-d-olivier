describe("BeneficiaireController", function () {

  var scope;
  var routeParams;
  var deferredAdd,deferredLoad;

  addBeneficiaireWithCode = function (firstName, lastName, code, card) {
    scope.currentBeneficiaire = {code: code};
    scope.currentBeneficiaire.lastName = lastName;
    scope.currentBeneficiaire.firstName = firstName;
    scope.currentBeneficiaire.hasCard = card !== false;
    scope.addBeneficiaireFromList();
  };

  addBeneficiaire = function (firstName, lastName) {
    addBeneficiaireWithCode(firstName, lastName, scope.initNextCode());
  };

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    routeParams = {};
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');

    deferredLoad = _$q_.defer();
    deferredAdd = _$q_.defer();

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
    var toBeAdded = {_id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    var added = {_id: '1', _rev:"1", code: 1, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredAdd.promise);

    addBeneficiaire('John', 'Rambo');
    scope.$apply();

    expect(dataService.addOrUpdateBeneficiaire).toHaveBeenCalledWith(toBeAdded);
    expect(scope.beneficiaires.length).toBe(1);
    expect(scope.beneficiaires).toContain(added);
  });

  it('should add a second beneficiaire', function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"FN1",lastName:"LN1", hasCard:true};
    deferredLoad.resolve([source]);
    spyOn(dataService, 'findAllBeneficiaires').andReturn(deferredLoad.promise);

    var toBeAdded = {_id: '2', code: 2, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    var added = {_id: '2', _rev:"1", code: 2, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredAdd.promise);


    scope.openBeneficiaireList();
    scope.$apply();
    expect(scope.beneficiaires.length).toBe(1);

    addBeneficiaire('John', 'Rambo');
    scope.$apply();

    expect(dataService.addOrUpdateBeneficiaire).toHaveBeenCalledWith(toBeAdded);

    expect(scope.beneficiaires.length).toBe(2);
    expect(scope.beneficiaires[0] === source).toEqual(true);
    expect(scope.beneficiaires[1] === added).toEqual(true);
  });

  it('should add a beneficiaire without code', function () {
    var toBeAdded = {_id: '1', code: null, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    var added = {_id: '1', _rev:"1", code: null, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredAdd.promise);
    scope.openBeneficiaireList();
    scope.$apply();

    expect(scope.beneficiaires.length).toBe(0);
    addBeneficiaireWithCode('John', 'Rambo', null);
    scope.$apply();

    expect(scope.beneficiaires.length).toBe(1);
    expect(dataService.addOrUpdateBeneficiaire).toHaveBeenCalledWith(toBeAdded);
    expect(scope.beneficiaires).toContain({_id: '1', _rev:'1', code: null, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true});
  });

  it('should add a beneficiaire without card', function () {
    var toBeAdded = {_id: '1', code: '1', firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: false};
    var added = {_id: '1', _rev:"1", code: '1', firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: false};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredAdd.promise);
    scope.openBeneficiaireList();
    scope.$apply();

    expect(scope.beneficiaires.length).toBe(0);
    addBeneficiaireWithCode('John', 'Rambo', '1', false);
    scope.$apply();

    expect(scope.beneficiaires.length).toBe(1);
    expect(dataService.addOrUpdateBeneficiaire).toHaveBeenCalledWith(toBeAdded);
    expect(scope.beneficiaires).toContain({_id: '1', _rev:'1', code: '1', firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: false});
  });

  it('should prevent the user to add an existing beneficiaire', function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"John",lastName:"Rambo", hasCard:true};
    deferredLoad.resolve([source]);
    spyOn(dataService, 'findAllBeneficiaires').andReturn(deferredLoad.promise);

    var added = {_id: '2', _rev:"1", code: 2, firstName: 'John', lastName: 'Rambo', isPresent: false, hasCard: true};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredAdd.promise);

    scope.openBeneficiaireList();
    scope.$apply();
    expect(scope.beneficiaires.length).toBe(1);

    try {
      addBeneficiaire('John', 'Rambo');
    }catch (exception){
      expect(exception.type).toBe("functional");
    }
    expect(scope.beneficiaires.length).toBe(1);
  });

});
