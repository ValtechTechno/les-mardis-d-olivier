describe("BeneficiaireDetailController", function () {

  var scope;
  var routeParams;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    routeParams = {};
    beneficiairesService = $injector.get('beneficiairesService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireDetailController', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      beneficiairesService: beneficiairesService,
      beneficiairesCommonService: beneficiairesCommonService
    });

  }));

  it('should delete a beneficiaire', function () {
    localStorage.setItem("beneficiairesPresentByDistribution", angular.toJson([
      {"distributionId": "1", "beneficiaireId": "1", "comment": "message"},
      {"distributionId": "2", "beneficiaireId": "1", "comment": "message2"},
      {"distributionId": "1", "beneficiaireId": "2"},
      {"distributionId": "2", "beneficiaireId": "2"}
    ]));
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "A1",
      "lastName": "A1"
    }, {"id": "2", "code": 2, "firstName": "A2", "lastName": "A2"}]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-09-16",
      "id": 1
    }, {"distributionDate": "2014-09-18", "id": 2}]));
    scope.$digest();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.deleteBeneficiaireDetail();
    scope.cancelBeneficiaireDetailDeletePopup();
    scope.deleteBeneficiaireDetail();
    scope.confirmBeneficiaireDetailDeletePopup();
    var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
    expect(beneficiaires.length).toEqual(1);
    var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
    expect(beneficiairesPresentByDistribution.length).toEqual(2);
  });

  it('should update an beneficiaire informations', function () {
    localStorage.setItem("beneficiairesPresentByDistribution", angular.toJson([
      {"distributionId": "1", "beneficiaireId": "1", "comment": "message"},
      {"distributionId": "2", "beneficiaireId": "1", "comment": "message2"}
    ]));
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "A1",
      "lastName": "A1"
    }, {"id": "2", "code": 2, "firstName": "A2", "lastName": "A2"}]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-09-16",
      "id": 1
    }, {"distributionDate": "2014-09-18", "id": 2}]));
    scope.$digest();
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.currentBeneficiaire.code = 2;
    scope.currentBeneficiaire.firstName = "A11";
    scope.currentBeneficiaire.lastName = "A11";
    scope.currentBeneficiaire.description = "test1";
    scope.currentBeneficiaire.excluded = true;
    scope.saveBeneficiaireDetail();
    expect(scope.currentError.isCodeNotUnique).toBe(true);
    scope.currentBeneficiaire.code = 3;
    scope.saveBeneficiaireDetail();
    var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
    expect(beneficiaires[0].code).toEqual(3);
    expect(beneficiaires[0].firstName).toEqual("A11");
    expect(beneficiaires[0].lastName).toEqual("A11");
    expect(beneficiaires[0].description).toEqual("test1");
    expect(beneficiaires[0].excluded).toEqual(true);
  });

  it('should show an beneficiaire informations', function () {
    localStorage.setItem("beneficiairesPresentByDistribution", angular.toJson([
      {"distributionId": "1", "beneficiaireId": "1", "comment": "message"},
      {"distributionId": -1, "beneficiaireId": "1", "comment": "message2", "date": "2015-01-19"}
    ]));
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "A1",
      "lastName": "A1"
    }, {"id": "2", "code": 2, "firstName": "A2", "lastName": "A2"}]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-09-16",
      "id": 1
    }]));
    scope.$digest();
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    expect(scope.currentBeneficiaire.comments.length).toEqual(2);
    expect(scope.currentBeneficiaire.comments[0]).toEqual("2015-01-19 : message2");
    expect(scope.currentBeneficiaire.comments[1]).toEqual("2014-09-16 : message");
    expect(scope.currentBeneficiaire.visiteNumber).toEqual(2);
  });

  it('should add an beneficiaire comment', function () {
    localStorage.setItem("beneficiairesPresentByDistribution", angular.toJson([
      {"distributionId": "1", "beneficiaireId": "1", "comment": "message"},
      {"distributionId": -1, "beneficiaireId": "1", "comment": "message2", "date": "2015-01-19"}
    ]));
    localStorage.setItem("beneficiaires", angular.toJson([{
      "id": "1",
      "code": 1,
      "firstName": "A1",
      "lastName": "A1"
    }, {"id": "2", "code": 2, "firstName": "A2", "lastName": "A2"}]));
    localStorage.setItem("distributions", angular.toJson([{
      "distributionDate": "2014-09-16",
      "id": 1
    }]));
    scope.$digest();
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.currentBeneficiaire.newComment = "Test New Comment";
    scope.addCommentaire();
    expect(scope.currentBeneficiaire.comments.length).toEqual(3);
  });
});
