describe("BeneficiaireDetailController", function () {

  var scope;
  var routeParams;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(inject(function (dataService) {
    dataService.clear()
  }));
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    routeParams = {};
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireDetailController', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });

    dataService.saveBeneficiaires([
        { id: '1', code: 1, firstName: 'A1', lastName: 'A1' },
        { id: '2', code: 2, firstName: 'A2', lastName: 'A2' }
    ]);
    dataService.saveBeneficiairesPresentByDistribution([
        { distributionId: '1', beneficiaireId: '1', comment: 'message', isBookmark: false},
        { distributionId: '2', beneficiaireId: '1', comment: 'message2', isBookmark: false},
        { distributionId: '1', beneficiaireId: '2'},
        { distributionId: '2', beneficiaireId: '2'}
    ]);
    dataService.saveDistributions([
        { distributionDate: "2014-09-16", id: 1 },
        { distributionDate: "2014-09-18", id: 2 }
    ]);
  }));

  it('should delete a beneficiaire', function () {
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.$emit('confirmBeneficiaireDetailDeletePopup');
    var beneficiaires = dataService.loadBeneficiaires();
    expect(beneficiaires.length).toEqual(1);
    var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
    expect(beneficiairesPresentByDistribution.length).toEqual(2);
  });

  it('should update an beneficiaire informations', function () {
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.currentBeneficiaire.firstName = "A11";
    scope.currentBeneficiaire.lastName = "A11";
    scope.currentBeneficiaire.description = "test1";
    scope.currentBeneficiaire.excluded = true;
    scope.currentBeneficiaire.hasCard = true;
    scope.saveBeneficiaireDetail();

    var beneficiaires = dataService.loadBeneficiaires();
    expect(beneficiaires[0].code).toEqual(1);
    expect(beneficiaires[0].firstName).toEqual("A11");
    expect(beneficiaires[0].lastName).toEqual("A11");
    expect(beneficiaires[0].description).toEqual("test1");
    expect(beneficiaires[0].excluded).toEqual(true);
    expect(beneficiaires[0].hasCard).toEqual(true);
  });

  it('should show a beneficiaire informations', function () {
    dataService.saveBeneficiairesPresentByDistribution([
      { distributionId: '1', beneficiaireId: '1', comment: 'message' },
      { distributionId: -1,  beneficiaireId: '1', comment: 'message2', date: "2015-01-19" }
    ]);
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    expect(scope.currentBeneficiaire.comments.length).toEqual(2);
    expect(scope.currentBeneficiaire.comments[0].text).toEqual("2015-01-19 : message2");
    expect(scope.currentBeneficiaire.comments[1].text).toEqual("2014-09-16 : message");
    expect(scope.currentBeneficiaire.visiteNumber).toEqual(2);
  });

  it('should bookmark an beneficiaire comment', function () {
    dataService.saveBeneficiairesPresentByDistribution([
      { distributionId: "1", beneficiaireId: '1', comment: 'message',  isBookmark:false },
      { distributionId: -1,  beneficiaireId: '1', comment: 'message2', isBookmark:false, date: "2015-01-19" }
    ]);
    scope.openBeneficiaireList();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.isBookmark({"distributionId": "1","isBookmark":true});
    var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
    expect(beneficiairesPresentByDistribution[0].isBookmark).toEqual(true);
    expect(beneficiairesPresentByDistribution[1].isBookmark).toEqual(false);
  });
});
