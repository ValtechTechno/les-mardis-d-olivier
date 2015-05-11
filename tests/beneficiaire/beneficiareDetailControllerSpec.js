describe("BeneficiaireDetailController", function () {

  var scope;
  var routeParams;
  var deferredLoad, deferredFind, deferredDelete, deferredLoadBbd, deferredDeleteBbd;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    routeParams = {};
    deferredLoad = _$q_.defer();
    deferredFind = _$q_.defer();
    deferredDelete = _$q_.defer();
    deferredLoadBbd = _$q_.defer();
    deferredDeleteBbd = _$q_.defer();
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireDetailController', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    //
    //dataService.saveBeneficiaires([
    //    { _id: '1', code: 1, firstName: 'A1', lastName: 'A1' },
    //    { _id: '2', code: 2, firstName: 'A2', lastName: 'A2' }
    //]);
    //dataService.saveBeneficiairesPresentByDistribution([
    //    { distributionId: '1', beneficiaireId: '1', comment: 'message', isBookmark: false},
    //    { distributionId: '2', beneficiaireId: '1', comment: 'message2', isBookmark: false},
    //    { distributionId: '1', beneficiaireId: '2'},
    //    { distributionId: '2', beneficiaireId: '2'}
    //]);
    //dataService.saveDistributions([
    //    { distributionDate: "2014-09-16", _id: 1 },
    //    { distributionDate: "2014-09-18", _id: 2 }
    //]);
  }));

  it('should delete a beneficiaire', function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"1",lastName:"1", hasCard:true};
    deferredLoad.resolve(source);
    spyOn(dataService, 'findBeneficiaireById').andReturn(deferredLoad.promise);

    deferredDelete.resolve(true);
    spyOn(dataService, 'removeBeneficiaire').andReturn(deferredDelete.promise);

    var sourceBbd = {_id:"1_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:1, comment:"test", isBookmark:true};
    deferredLoadBbd.resolve([sourceBbd]);
    spyOn(dataService, 'findBeneficiaireByDistributionByBeneficiaireId').andReturn(deferredLoadBbd.promise);

    deferredDeleteBbd.resolve(true);
    spyOn(dataService, 'removeBeneficiaireByDistributionByBeneficiaire').andReturn(deferredDeleteBbd.promise);

    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.$apply();
    scope.$emit('confirmBeneficiaireDetailDeletePopup');
    scope.$apply();

    expect(dataService.findBeneficiaireByDistributionByBeneficiaireId).toHaveBeenCalledWith('1');
    expect(dataService.removeBeneficiaire).toHaveBeenCalledWith(source);
    expect(dataService.removeBeneficiaireByDistributionByBeneficiaire).toHaveBeenCalledWith([sourceBbd]);
  });

  it('should update an beneficiaire informations', function () {
    deferredLoad.resolve([]);
    spyOn(dataService, 'findAllBeneficiaires').andReturn(deferredLoad.promise);

    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"1",lastName:"1", hasCard:true};
    deferredFind.resolve(source);
    spyOn(dataService, 'findBeneficiaireById').andReturn(deferredFind.promise);
    spyOn(dataService, 'addOrUpdateBeneficiaire').andReturn(deferredFind.promise);

    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.$apply();
    scope.currentBeneficiaire.firstName = "A11";
    scope.currentBeneficiaire.lastName = "A11";
    scope.currentBeneficiaire.description = "test1";
    scope.currentBeneficiaire.excluded = true;
    scope.currentBeneficiaire.hasCard = true;
    scope.saveBeneficiaireDetail();
    scope.$apply();

    var target = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"A11",lastName:"A11",hasCard:true, description:"test1", excluded: true};
    expect(dataService.addOrUpdateBeneficiaire).toHaveBeenCalledWith(target);
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
    var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
    expect(beneficiairesPresentByDistribution[0].isBookmark).toEqual(true);
    expect(beneficiairesPresentByDistribution[1].isBookmark).toEqual(false);
  });
});
