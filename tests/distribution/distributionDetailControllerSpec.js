describe("DistributionDetailController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;
  var deferredFindAllBenef, deferredFindAllDistributionsById, deferredFindAllDistributions, deferredFindAllBbd, deferredAddOrUpdateBbd;
  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_,$rootScope, $controller, $filter, $injector, $routeParams) {
    scope = $rootScope.$new();
    $rootScope.account = {antenneId : 1};
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
    deferredFindAllBenef = _$q_.defer();
    deferredAddOrUpdateBbd = _$q_.defer();
    deferredFindAllDistributionsById = _$q_.defer();
    deferredFindAllDistributions = _$q_.defer();
    deferredFindAllBbd = _$q_.defer();
  }));

  it('should be possible to save beneficiaire presence at a distribution', function () {

    deferredFindAllBenef.resolve([{_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"John",lastName:"Rambo", hasCard:true}]);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-19", _id: 3 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-16", _id: 1 },{ distributionDate: "2014-09-18", _id: 2 }, { distributionDate: "2014-09-19", _id: 3 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    deferredFindAllBbd.resolve([{_id: '1_1', beneficiaireId:1, distributionId:1 },{_id: '2_1', beneficiaireId:1, distributionId:2}]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    spyOn(dataService, 'addOrUpdateBeneficiaireByDistribution').andReturn(deferredAddOrUpdateBbd.promise);

    routeParams.distributionId = 3;
    scope.distributionDetail.activate();
    scope.$apply();
    expect(scope.distributionDetail.numberBeneficiairesPresent).toEqual(0);

    scope.distributionDetail.beneficiaires[0].isPresent = true;
    scope.distributionDetail.isPresent(scope.distributionDetail.beneficiaires[0]);
    scope.$apply();
    expect(scope.distributionDetail.numberBeneficiairesPresent).toEqual(1);

    expect(dataService.addOrUpdateBeneficiaireByDistribution).toHaveBeenCalledWith({distributionId:'3', beneficiaireId:'1', antenneId:1});
  });

  it('should return an empty list when the distribution has nobody present', function () {

    deferredFindAllBenef.resolve([]);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-19", _id: 3 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-19", _id: 3 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    deferredFindAllBbd.resolve([]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    scope.$apply();
    expect(scope.distributionDetail.numberBeneficiairesPresent).toEqual(0);
    expect(scope.distributionDetail.beneficiaires.length).toEqual(0);

  });

  it('should be only returns the present beneficiaire from a open distribution', function () {

    var sourceBenef = [{_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"John",lastName:"Rambo", hasCard:true},
      {_id:"2", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:2,firstName:"Alix",lastName:"Rambo", hasCard:true},
      {_id:"3", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:3,firstName:"Lana",lastName:"Rambo", hasCard:true}];
    deferredFindAllBenef.resolve(sourceBenef);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-19", _id: 1 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-16", _id: 1 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    deferredFindAllBbd.resolve([{_id: '1_1', beneficiaireId:'1', distributionId:'1' },{_id: '1_3', beneficiaireId:'3', distributionId:'1'}]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    scope.$apply();

    expect(scope.distributionDetail.numberBeneficiairesPresent).toEqual(2);
    expect(scope.distributionDetail.beneficiaires.length).toEqual(3);

    expect(scope.distributionDetail.beneficiaires[0].isPresent).toEqual(true);
    expect(scope.distributionDetail.beneficiaires[0].firstName).toEqual('John');
    expect(scope.distributionDetail.beneficiaires[1].isPresent).toEqual(false);
    expect(scope.distributionDetail.beneficiaires[1].firstName).toEqual('Alix');
    expect(scope.distributionDetail.beneficiaires[2].isPresent).toEqual(true);
    expect(scope.distributionDetail.beneficiaires[2].firstName).toEqual('Lana');

  });

  it('should be possible to save a comment on a beneficiaire during one distribution', function () {

    deferredFindAllBenef.resolve([{_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"John",lastName:"Rambo", hasCard:true}]);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-19", _id: 1 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-16", _id: 1 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    deferredFindAllBbd.resolve([{_id: '1_1', beneficiaireId:1, distributionId:1 }]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    spyOn(dataService, 'addOrUpdateBeneficiaireByDistribution').andReturn(deferredAddOrUpdateBbd.promise);

    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    scope.$apply();

    var comment = "Incorrect";
    scope.distributionDetail.writeComment(1, comment);
    scope.$apply();

    expect(dataService.addOrUpdateBeneficiaireByDistribution).toHaveBeenCalledWith({_id: '1_1', beneficiaireId:1, distributionId:1, comment:comment });

  });

  it('should format a date for french people', function () {
    expect(DateWithJQueryUiDatePicker('2014-08-04')).toBe('lundi 4 août 2014');
  });

  it('should see older bookmarked comments of a beneficiaire in distribution', function () {
    deferredFindAllBenef.resolve([{_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f",code:1,firstName:"John",lastName:"Rambo", hasCard:true}]);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-16", _id: 1 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-16", _id: 1 },{ distributionDate: "2014-09-18", _id: 2 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    var oldComment = 'older comment to show';
    deferredFindAllBbd.resolve([{_id: '1_1', beneficiaireId:1, distributionId:1, comment:oldComment, isBookmark:true }]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    routeParams.distributionId = 2;
    scope.distributionDetail.activate();
    scope.$apply();

    expect(scope.distributionDetail.beneficiaires[0].comments[0].text).toEqual("2014-09-16 : "+oldComment);
  });

  it('should be possible to save a comment on a distribution', function () {
    deferredFindAllBenef.resolve([]);
    spyOn(dataService, 'findAllBeneficiairesByAntenneId').andReturn(deferredFindAllBenef.promise);

    deferredFindAllDistributionsById.resolve({ distributionDate: "2014-09-19", _id: 3 });
    spyOn(dataService, 'findDistributionById').andReturn(deferredFindAllDistributionsById.promise);

    deferredFindAllDistributions.resolve([{ distributionDate: "2014-09-19", _id: 3 }]);
    spyOn(dataService, 'findDistributionByIds').andReturn(deferredFindAllDistributions.promise);

    deferredFindAllBbd.resolve([]);
    spyOn(dataService, 'findAllBeneficiaireByDistributionByAntenneId').andReturn(deferredFindAllBbd.promise);

    deferredAddOrUpdateBbd.resolve([]);
    spyOn(dataService, 'addOrUpdateDistribution').andReturn(deferredAddOrUpdateBbd.promise);

    routeParams.distributionId = 1;
    scope.distributionDetail.activate();
    scope.$apply();

    var commentaireDistribution = "commentaire general";
    scope.distributionDetail.writeDistributionComment(commentaireDistribution);
    scope.$apply();

    expect(dataService.addOrUpdateDistribution).toHaveBeenCalledWith({ distributionDate: "2014-09-19", _id: 3, comment:commentaireDistribution });

  });

});
