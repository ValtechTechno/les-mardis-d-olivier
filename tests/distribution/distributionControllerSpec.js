describe("DistributionController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;
  var deferredAdd,deferredLoad;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(angular.mock.inject(function (_$q_, $rootScope, $controller, $filter, $injector) {
    scope = $rootScope.$new();
    dataService = $injector.get('dataService');
    beneficiairesCommonService = $injector.get('commonService');
    DateWithJQueryUiDatePicker = $filter('DateWithJQueryUiDatePicker');
    $controller('DistributionController', {
      $scope: scope,
      $filter: $filter,
      dataService: dataService,
      beneficiairesCommonService: beneficiairesCommonService
    });
    deferredLoad = _$q_.defer();
    deferredAdd = _$q_.defer();
  }));

  it("should save a new distribution", function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", nbPlannedMeals:50, distributionDate:"2014-08-04"};
    deferredLoad.resolve([source]);
    spyOn(dataService, 'findAllDistributions').andReturn(deferredLoad.promise);

    var added = {_id:"2", _rev:"1-019ebd7431186fe904dd2dc037e1806f", nbPlannedMeals:50, distributionDate:"2014-08-05"};
    deferredAdd.resolve(added);
    spyOn(dataService, 'addOrUpdateDistribution').andReturn(deferredAdd.promise);

    scope.showAllDistribution();
    scope.$apply();
    expect(scope.currentDistribution.distributionDate).toEqual("2014-08-05");

    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-05";
    scope.startNewDistribution();
    scope.$apply();

    expect(scope.currentDistribution._id).toBe(2);
    expect(dataService.addOrUpdateDistribution).toHaveBeenCalledWith({distributionDate:"2014-08-05", nbPlannedMeals:'50', _id:2});
  });

  it("shouldn't be possible to save two distribution at the same date", function () {
    var source = {_id:"1", _rev:"1-019ebd7431186fe904dd2dc037e1806f", nbPlannedMeals:50, distributionDate:"2014-08-04"};
    deferredLoad.resolve([source]);
    spyOn(dataService, 'findAllDistributions').andReturn(deferredLoad.promise);

    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    var isError = false;
    try {
      scope.saveNewDistribution();
    } catch (err) {
      isError = true;
    }
    expect(isError).toBe(true);
  });

});
