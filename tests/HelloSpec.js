describe("Les Mardis d'Olivier", function () {

  var scope;
  var DateWithJQueryUiDatePicker;

  addBeneficiaireWithCode = function (firstName, lastName, code) {
    scope.currentBeneficiaire = {code: code};
    scope.currentBeneficiaire.lastName = lastName;
    scope.currentBeneficiaire.firstName = firstName;
    scope.addBeneficiaireFromDistribution();
  };

  addBeneficiaire = function (firstName, lastName) {
    addBeneficiaireWithCode(firstName, lastName, beneficiairesCommonService.initNextCode(scope));
  };

  leftCurrentDistribution = function () {
    scope.currentDistribution = {};
    beneficiairesCommonService.resetAddBeneficiareForm(scope);
    scope.showAllDistribution();
    scope.currentPage = {distributionList: true};
    scope.numberBeneficiairesPresent = 0;
  };

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    beneficiairesService = $injector.get('beneficiairesService');
    beneficiairesCommonService = $injector.get('commonService');
    DateWithJQueryUiDatePicker = $filter('DateWithJQueryUiDatePicker');
    $controller('DistributionController', {
      $scope: scope,
      $filter: $filter,
      beneficiairesService: beneficiairesService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    $controller('BeneficiaireController', {
      $scope: scope,
      $filter: $filter,
      beneficiairesService: beneficiairesService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    $controller('AboutController', {
      $scope: scope,
      $filter: $filter,
      beneficiairesService: beneficiairesService
    });
    beneficiairesCommonService.resetAddBeneficiareForm(scope);
    scope.currentBeneficiaire = {code: beneficiairesCommonService.initNextCode(scope)};
  }));

  it('should add a beneficiaire', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires).toContain({id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: true});
  });

  it('should add a beneficiaire without code', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaireWithCode('John', 'Rambo', null);

    expect(scope.beneficiaires).toContain({id: '1', code: null, firstName: 'John', lastName: 'Rambo', isPresent: true});
  });

  it('calculates the beneficiaire id by incrementing the last id in the list', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('Alix', 'Rambo');
    addBeneficiaire('Lana', 'Rambo');

    expect(scope.beneficiaires).toEqual(
      [
        {id: '1', code: 1, firstName: 'John', lastName: 'Rambo', isPresent: true},
        {id: '2', code: 2, firstName: 'Alix', lastName: 'Rambo', isPresent: true},
        {id: '3', code: 3, firstName: 'Lana', lastName: 'Rambo', isPresent: true}
      ]
    );
  });

  it('should prevent the user to add an existing beneficiaire', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires.length).toBe(1);
    expect(scope.currentError.isBeneficiaireNotUnique).toBe(true);
  });

  it('should prevent the user to add an existing id for beneficiaire', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaireWithCode('John', 'Rambo', '1');
    addBeneficiaireWithCode('Michel', 'Rambo', '1');

    expect(scope.beneficiaires.length).toBe(1);
    expect(scope.currentError.isCodeNotUnique).toBe(true);
  });

  it('should not allow to add a beneficiaire with empty first name or last name', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('', '');
    addBeneficiaire('John', '');
    addBeneficiaire('', 'Rambo');

    expect(scope.beneficiaires.length).toBe(0);
  });

  it('should save beneficiaires to localStorage', function () {
    scope.currentDistribution.id = 1;
    scope.$digest();
    addBeneficiaire('foo', 'bar');
    scope.$digest();

    expect(localStorage.getItem('beneficiaires')).toBe('[{"id":"1","code":1,"firstName":"foo","lastName":"bar"}]');
  });

  it("should save a new distribution", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-05";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution(beneficiairesService))
      .toEqual([
        {
          "distributionDate": "2014-08-05",
          "nbPlannedMeals": "50",
          id: 2
        },
        {
          "distributionDate": "2014-08-04",
          "nbPlannedMeals": "50",
          id: 1
        }
      ]);
  });

  it("calculates the distribution id by incrementing the last id in the list", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-05";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-06";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution(beneficiairesService))
      .toEqual([
        {
          "distributionDate": "2014-08-06",
          "nbPlannedMeals": "50",
          id: 3
        },
        {
          "distributionDate": "2014-08-05",
          "nbPlannedMeals": "50",
          id: 2
        },
        {
          "distributionDate": "2014-08-04",
          "nbPlannedMeals": "50",
          id: 1
        }
      ]);
  });

  it("shouldn't be possible to save two distribution at the same date", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.saveNewDistribution();
    try {
      scope.saveNewDistribution();
    } catch (err) {
    }

    expect(retrieveAllDistribution(beneficiairesService))
      .toEqual([{
        "distributionDate": "2014-08-04",
        "nbPlannedMeals": "50",
        id: 1
      }]);
  });

  it('should not allow to add a distribution with empty number of meals', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "";
    scope.currentDistribution.distributionDate = "2014-08-04";

    try {
      scope.saveNewDistribution();
    } catch (err) {
    }

    expect(retrieveAllDistribution(beneficiairesService)).toEqual([]);
  });

  it('should not allow to add a distribution with empty date', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "";

    try {
      scope.saveNewDistribution();
    } catch (err) {
    }

    expect(retrieveAllDistribution(beneficiairesService)).toEqual([]);
  });

  it("should be able to init give the next date (working day) of a distribution based on the previous one.", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-08";
    scope.startNewDistribution();
    leftCurrentDistribution();
    expect(scope.currentDistribution.distributionDate).toEqual("2014-08-11");
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-11";
    scope.startNewDistribution();
    leftCurrentDistribution();
    expect(scope.currentDistribution.distributionDate).toEqual("2014-08-12");
  });

  it('should be possible to save beneficiaire presence at a distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.currentDistribution.id = scope.saveNewDistribution();
    scope.$digest();
    addBeneficiaire('John', 'Rambo');
    scope.$digest();

    beneficiaireCode = scope.beneficiaires[0].id;

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id, beneficiairesService);
    expect(beneficiairesList[0].id).toEqual(beneficiaireCode);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
  });

  it('should return an empty list when the distribution has nobody present', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.saveNewDistribution();

    expect(retrieveBeneficiairesByDistribution(scope.currentDistribution.distributionId, beneficiairesService)).toEqual([]);
  });

  it('should be only returns the present beneficiaire from a open distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    addBeneficiaire('John', 'Rambo');
    scope.$digest();
    addBeneficiaire('Alix', 'Rambo');
    scope.$digest();
    addBeneficiaire('Lana', 'Rambo');
    scope.$digest();

    scope.isPresent(scope.beneficiaires[1]);

    leftCurrentDistribution();
    scope.loadDistribution(1, false);

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, beneficiairesService, false);
    expect(beneficiairesList.length).toEqual(3);
    expect(beneficiairesList[0].isPresent).toEqual(true);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(false);
    expect(beneficiairesList[1].firstName).toEqual('Alix');
    expect(beneficiairesList[2].isPresent).toEqual(true);
    expect(beneficiairesList[2].firstName).toEqual('Lana');
  });

  it('should be only returns the present beneficiaire from a closed distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    addBeneficiaire('John', 'Rambo');
    scope.$digest();
    addBeneficiaire('Alix', 'Rambo');
    scope.$digest();
    addBeneficiaire('Lana', 'Rambo');
    scope.$digest();

    scope.isPresent(scope.beneficiaires[1]);

    leftCurrentDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-05";
    scope.startNewDistribution();
    leftCurrentDistribution();

    scope.loadDistribution(2, true);

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, beneficiairesService, true);
    expect(beneficiairesList.length).toEqual(2);
    expect(beneficiairesList[0].isPresent).toEqual(true);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(true);
    expect(beneficiairesList[1].firstName).toEqual('Lana');
  });

  it('should be possible to save a comment on a beneficiaire during one distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.currentDistribution.id = scope.saveNewDistribution();
    scope.$digest();
    addBeneficiaire('John', 'Rambo');
    scope.$digest();

    var beneficiaireId = scope.beneficiaires[0].id;
    var comment = "Pas gentil";

    scope.writeComment(beneficiaireId, comment);

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id, beneficiairesService, true);
    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
    expect(beneficiairesList[0].comment).toEqual(comment);
  });

  it('should format a date for french people', function () {
    expect(DateWithJQueryUiDatePicker('2014-08-04')).toBe('lundi 4 août 2014');
  });

  it('should retrieve the number of beneficiaires present at a distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.currentDistribution.id = scope.saveNewDistribution();
    scope.$digest();
    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('Michel', 'Rambo');
    addBeneficiaire('Paul', 'Rambo');
    scope.$digest();

    var beneficiairesList = retrieveAllDistribution(beneficiairesService);

    expect(beneficiairesList[0].nbBeneficiaires).toEqual(3);
  });

  it('should see older comments of a beneficiaire', function () {
    localStorage.setItem("beneficiairesPresentByDistribution", angular.toJson([
      {"distributionId": "1", "beneficiaireId": "1", "comment": "message"},
      {"distributionId": "2", "beneficiaireId": "1", "comment": "message2"}
    ]));
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "A1",
      "lastName": "A1"
    }]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-09-16",
      "id": 1
    }, {"distributionDate": "2014-09-18", "id": 2}]));

    var beneficiaires = retrieveBeneficiairesByDistribution(2, beneficiairesService, true);

    expect(beneficiaires[0].comment).toEqual("message2");
    expect(beneficiaires[0].comments[0]).toEqual("2014-09-16 : message");
  });

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
