describe("BeneficiaireDetailController", function () {

  var scope;
  var routeParams;
  var deferredLoad, deferredFind, deferredDelete, deferredLoadBbd, deferredDeleteBbd, deferredLoadDistri, deferreUpdateBbd;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    $rootScope.account = {antenneId : 1};
    routeParams = {};
    deferredLoad = _$q_.defer();
    deferredFind = _$q_.defer();
    deferredDelete = _$q_.defer();
    deferredLoadBbd = _$q_.defer();
    deferredDeleteBbd = _$q_.defer();
    deferredLoadDistri = _$q_.defer();
    deferreUpdateBbd = _$q_.defer();
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');

    $controller('BeneficiaireDetailController', {
      $scope: scope,
      $routeParams: routeParams,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });
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
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredLoad.promise);

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
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"1",lastName:"1", hasCard:true};
    deferredLoad.resolve(source);
    spyOn(dataService, 'findBeneficiaireById').andReturn(deferredLoad.promise);

    var sourceBbd = [{_id:"1_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:1, comment:"message", isBookmark:true},{_id:"2_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:2}];
    deferredLoadBbd.resolve(sourceBbd);
    spyOn(dataService, 'findBeneficiaireByDistributionByBeneficiaireId').andReturn(deferredLoadBbd.promise);

    var sourceDistri = [
          { distributionDate: "2014-09-16", _id: 1 },
          { distributionDate: "2014-09-18", _id: 2 }
      ];
    deferredLoadDistri.resolve(sourceDistri);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredLoadDistri.promise);

    scope.openBeneficiaireList();
    scope.$apply();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.$apply();
    expect(scope.currentBeneficiaireComments.length).toEqual(1);
    expect(scope.currentBeneficiaireComments[0].commentWithDate).toEqual("2014-09-16 : message");
    expect(scope.currentBeneficiaireVisiteNumber).toEqual(2);
  });

  it('should bookmark an beneficiaire comment', function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"1",lastName:"1", hasCard:true};
    deferredLoad.resolve(source);
    spyOn(dataService, 'findBeneficiaireById').andReturn(deferredLoad.promise);

    var sourceBbd = [{_id:"1_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:1, comment:"message", isBookmark:true},{_id:"2_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:2, comment:"message2", isBookmark:false}];
    deferredLoadBbd.resolve(sourceBbd);
    spyOn(dataService, 'findBeneficiaireByDistributionByBeneficiaireId').andReturn(deferredLoadBbd.promise);

    var sourceDistri = [
      { distributionDate: "2014-09-16", _id: 1 },
      { distributionDate: "2014-09-18", _id: 2 }
    ];
    deferredLoadDistri.resolve(sourceDistri);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredLoadDistri.promise);

    spyOn(dataService, 'addOrUpdateBeneficiaireByDistribution').andReturn(deferreUpdateBbd.promise);

    scope.openBeneficiaireList();
    scope.$apply();
    routeParams.beneficiaireId = 1;
    scope.openBeneficiaireDetail();
    scope.$apply();

    scope.currentBeneficiaireComments[0].isBookmark = false;
    scope.isBookmark(scope.currentBeneficiaireComments[0]);
    scope.$apply();
    expect(dataService.addOrUpdateBeneficiaireByDistribution).toHaveBeenCalledWith({_id:"1_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:1, comment:"message"});

    scope.currentBeneficiaireComments[1].isBookmark = true;
    scope.isBookmark(scope.currentBeneficiaireComments[1]);
    scope.$apply();
    expect(dataService.addOrUpdateBeneficiaireByDistribution).toHaveBeenCalledWith({_id:"2_1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", beneficiaireId:'1', distributionId:2, comment:"message2", isBookmark:true});
  });
});
