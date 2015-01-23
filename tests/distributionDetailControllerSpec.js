describe("DistributionDetailController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    routeParams = {};
    beneficiairesService = $injector.get('beneficiairesService');
    beneficiairesCommonService = $injector.get('commonService');
    DateWithJQueryUiDatePicker = $filter('DateWithJQueryUiDatePicker');
    $controller('DistributionDetailController', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      beneficiairesService: beneficiairesService,
      beneficiairesCommonService: beneficiairesCommonService
    });
  }));

  it('should be possible to save beneficiaire presence at a distribution', function () {
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    }]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();
    beneficiaireId = scope.beneficiaires[0].id;

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id, beneficiairesService, false);

    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
  });

  it('should return an empty list when the distribution has nobody present', function () {
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();
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
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();

    scope.isPresent(scope.beneficiaires[1]);

    scope.showDistribution();

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, beneficiairesService, false);
    expect(beneficiairesList.length).toEqual(3);
    expect(beneficiairesList[0].isPresent).toEqual(false);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(true);
    expect(beneficiairesList[1].firstName).toEqual('Alix');
    expect(beneficiairesList[2].isPresent).toEqual(false);
    expect(beneficiairesList[2].firstName).toEqual('Lana');
  });

  it('should be possible to save a comment on a beneficiaire during one distribution', function () {
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    }]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();

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
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();
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
    expect(beneficiaires[0].comments[1]).toEqual("2014-09-16 : message");
    expect(beneficiaires[0].comments[0]).toEqual("[DATE] : message2");
  });

  it('should be possible to save a comment on a distribution', function () {
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "John",
      "lastName": "Rambo"
    }]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-08-04",
      "id": 1
    }]));
    routeParams.distributionId = 1;
    scope.showDistribution();
    var commentaireDistribution = "commentaire general";
    scope.writeDistributionComment(commentaireDistribution);

    var distributions = beneficiairesService.allDistributions();
    expect(distributions[0].comment).toEqual(commentaireDistribution);
  });

});
