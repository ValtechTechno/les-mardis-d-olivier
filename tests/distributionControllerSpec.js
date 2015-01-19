describe("DistributionController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;

  leftCurrentDistribution = function () {
    scope.currentDistribution = {};
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
  }));

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
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    }]));
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    beneficiaireId = scope.beneficiaires[0].id;

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id, beneficiairesService, false);

    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
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
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    },{
      "id": "2",
      "code": 2,
      "firstName": "Alix",
      "lastName": "Rambo"
    },{
      "id": "3",
      "code": 3,
      "firstName": "Lana",
      "lastName": "Rambo"
    }]));
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    scope.isPresent(scope.beneficiaires[1]);

    leftCurrentDistribution();
    scope.loadDistribution(1, false);

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, beneficiairesService, false);
    expect(beneficiairesList.length).toEqual(3);
    expect(beneficiairesList[0].isPresent).toEqual(false);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(true);
    expect(beneficiairesList[1].firstName).toEqual('Alix');
    expect(beneficiairesList[2].isPresent).toEqual(false);
    expect(beneficiairesList[2].firstName).toEqual('Lana');
  });

  it('should be only returns the present beneficiaire from a closed distribution', function () {
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    },{
      "id": "2",
      "code": 2,
      "firstName": "Alix",
      "lastName": "Rambo"
    },{
      "id": "3",
      "code": 3,
      "firstName": "Lana",
      "lastName": "Rambo"
    }]));

    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    scope.isPresent(scope.beneficiaires[0]);
    scope.isPresent(scope.beneficiaires[2]);

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
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    }]));
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();

    scope.isPresent(scope.beneficiaires[0]);
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
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    },{
      "id": "2",
      "code": 2,
      "firstName": "Michel",
      "lastName": "Rambo"
    },{
      "id": "3",
      "code": 3,
      "firstName": "Paul",
      "lastName": "Rambo"
    }]));
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.startNewDistribution();
    scope.isPresent(scope.beneficiaires[0]);
    scope.isPresent(scope.beneficiaires[1]);
    scope.isPresent(scope.beneficiaires[2]);

    var beneficiairesList = retrieveAllDistribution(beneficiairesService);

    expect(beneficiairesList[0].nbBeneficiaires).toEqual(3);
  });

  it('should see older comments of a beneficiaire in distribution', function () {
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

});
