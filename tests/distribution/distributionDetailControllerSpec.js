describe("DistributionDetailController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(inject(function (dataService) {
    dataService.clear()
  }));
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    routeParams = {};
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');
    DateWithJQueryUiDatePicker = $filter('DateWithJQueryUiDatePicker');
    $controller('DistributionDetailController as distributionDetail', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });
  }));

  it('should be possible to save beneficiaire presence at a distribution', function () {
    dataService.saveBeneficiaires([
      { id: '1', code: 1, firstName: "John",
      "lastName": "Rambo"
    }]);
    dataService.saveDistributions([{ distributionDate: "2014-08-04", id: 1 }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    beneficiaireId = scope.distributionDetail.beneficiaires[0].id;

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.distributionDetail.currentDistribution.id, dataService, false);

    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
  });

  it('should return an empty list when the distribution has nobody present', function () {
    dataService.saveDistributions([{ distributionDate: "2014-08-04", id: 1 }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    expect(retrieveBeneficiairesByDistribution(scope.distributionDetail.currentDistribution.distributionId, dataService)).toEqual([]);
  });

  it('should be only returns the present beneficiaire from a open distribution', function () {
    dataService.saveBeneficiaires([
        { id: '1', code: 1, firstName: 'John', lastName: 'Rambo' },
        { id: '2', code: 2, firstName: 'Alix', lastName: 'Rambo' },
        { id: '3', code: 3, firstName: 'Lana', lastName: 'Rambo' }
    ]);
    dataService.saveDistributions([{ distributionDate: '2014-08-04', id: 1 }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();

    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[1]);

    scope.distributionDetail.activate();

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, dataService, false);
    expect(beneficiairesList.length).toEqual(3);
    expect(beneficiairesList[0].isPresent).toEqual(false);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(true);
    expect(beneficiairesList[1].firstName).toEqual('Alix');
    expect(beneficiairesList[2].isPresent).toEqual(false);
    expect(beneficiairesList[2].firstName).toEqual('Lana');
  });

  it('should be possible to save a comment on a beneficiaire during one distribution', function () {
    dataService.saveBeneficiaires([{ id: '1', code: 1, firstName: 'John', lastName: 'Rambo' }]);
    dataService.saveDistributions([{ id: 1, distributionDate: '2014-08-04' }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();

    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[0]);
    var beneficiaireId = scope.distributionDetail.beneficiaires[0].id;
    var comment = "Pas gentil";

    scope.distributionDetail.writeComment(beneficiaireId, comment);

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.distributionDetail.currentDistribution.id, dataService, true);
    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
    expect(beneficiairesList[0].comment).toEqual(comment);
  });

  it('should format a date for french people', function () {
    expect(DateWithJQueryUiDatePicker('2014-08-04')).toBe('lundi 4 août 2014');
  });

  it('should retrieve the number of beneficiaires present at a distribution', function () {
    dataService.saveBeneficiaires([
        { id: '1', code: 1, firstName: 'John', lastName: 'Rambo' },
        { id: '2', code: 2, firstName: 'Michel', lastName: 'Rambo' },
        { id: '3', code: 3, firstName: 'Paul', lastName: 'Rambo' }
    ]);
    dataService.saveDistributions([{ distributionDate: '2014-08-04', id: 1 }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[0]);
    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[1]);
    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[2]);

    var beneficiairesList = retrieveAllDistribution(dataService);

    expect(beneficiairesList[0].nbBeneficiaires).toEqual(3);
  });

  it('should see older bookmarked comments of a beneficiaire in distribution', function () {
    dataService.saveBeneficiairesPresentByDistribution([
      { distributionId: '1', beneficiaireId: '1', comment: 'message', isBookmark: true },
      { distributionId: '2', beneficiaireId: '1', comment: 'message2', isBookmark: true },
      { distributionId: '2', beneficiaireId: '1', comment: 'message2', isBookmark: false }
    ]);
    dataService.saveBeneficiaires([{ id: '1', code: 1, firstName: 'A1', lastName: 'A1' }]);
    dataService.saveDistributions([
      { distributionDate: '2014-09-16', id: 1 },
      { distributionDate: '2014-09-18', id: 2 }
    ]);

    var beneficiaires = retrieveBeneficiairesByDistribution(2, dataService, true);

    expect(beneficiaires[0].comment).toEqual("message2");
    expect(beneficiaires[0].comments[1].text).toEqual("2014-09-16 : message");
    expect(beneficiaires[0].comments[0].text).toEqual("[DATE] : message2");
  });

  it('should be possible to save a comment on a distribution', function () {
    dataService.saveBeneficiaires([{ id: '1', code: 1, firstName: 'John', lastName: 'Rambo' }]);
    dataService.saveDistributions([{ distributionDate: '2014-08-04', id: 1 }]);
    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    var commentaireDistribution = "commentaire general";
    scope.distributionDetail.writeDistributionComment(commentaireDistribution);

    var distributions = dataService.allDistributions();
    expect(distributions[0].comment).toEqual(commentaireDistribution);
  });

});
