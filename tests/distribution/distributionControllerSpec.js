describe("DistributionController", function () {

  var scope;
  var DateWithJQueryUiDatePicker;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function () {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function ($rootScope, $controller, $filter, $injector) {
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
  }));

  it("should save a new distribution", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-04";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-05";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution(dataService))
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
    expect(retrieveAllDistribution(dataService))
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

    expect(retrieveAllDistribution(dataService))
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

    expect(retrieveAllDistribution(dataService)).toEqual([]);
  });

  it('should not allow to add a distribution with empty date', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "";

    try {
      scope.saveNewDistribution();
    } catch (err) {
    }

    expect(retrieveAllDistribution(dataService)).toEqual([]);
  });

  it("should be able to init give the next date (working day) of a distribution based on the previous one.", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-08";
    scope.startNewDistribution();
    scope.showAllDistribution();
    expect(scope.currentDistribution.distributionDate).toEqual("2014-08-11");
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDate = "2014-08-11";
    scope.startNewDistribution();
    scope.showAllDistribution();
    expect(scope.currentDistribution.distributionDate).toEqual("2014-08-12");
  });

});
