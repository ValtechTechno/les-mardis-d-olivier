describe('Initialisation check', function() {

  var scope;

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function() {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function($rootScope, $controller, $filter, ngTableParams){
    scope = $rootScope.$new();
    $controller('contentCtrl', {
      $scope: scope,
      $filter: $filter,
      Date: new Date(1981, 11, 24),
      ngTableParams: ngTableParams
    });
  }));

  it('should add a beneficiaire', function () {
    scope.addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires).toContain({code:'', firstName:'John',lastName:'Rambo'});
  });

  it('should not allow to add an existing beneficiaire', function () {
    scope.beneficiaires.push({firstName:'John',lastName:'Rambo'});

    scope.addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires.length).toBe(1);
  });

  it('should not allow to add a beneficiaire with empty first name or last name', function () {
    scope.addBeneficiaire('', '');
    scope.addBeneficiaire('John', '');
    scope.addBeneficiaire('', 'Rambo');

    expect(scope.beneficiaires.length).toBe(0);
  });

  it('should save beneficiaires to localStorage', function () {
    scope.addBeneficiaire('foo', 'bar');
    scope.$digest();

    expect(localStorage.getItem('beneficiaires')).toBe('[{"code":"","firstName":"foo","lastName":"bar"}]');
  });

  it("is is possible to save a new distribution", function () {
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear = "2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "mardi";
    scope.distributionDateDayNumber = "05";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear = "2014";
    scope.distributionDateLabel = "mardi 05 août 2014";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution())
      .toEqual([
        {
          "distributionDateLabel":"mardi 05 août 2014",
          "distributionDateDayLabel":"mardi",
          "distributionDateDayNumber":"05",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50"
        },
        {
          "distributionDateLabel":"lundi 04 août 2014",
          "distributionDateDayLabel":"lundi",
          "distributionDateDayNumber":"04",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50"
        }
      ]);
  });

  it("shouldn't be possible to save two distribution at the same date", function () {
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();
    try{scope.saveNewDistribution();}catch(err){}

    expect(retrieveAllDistribution())
      .toEqual([{
        "distributionDateLabel":"lundi 04 août 2014",
        "distributionDateDayLabel":"lundi",
        "distributionDateDayNumber":"04",
        "distributionDateMonthLabel":"août",
        "distributionDateYear":"2014",
        "nbPlannedMeals":"50"
      }]);
  })

  it('should not allow to add a distribution with empty date or number of meals', function () {
    scope.distributionNbPlannedMeals = "";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.distributionNbPlannedMeals = "50";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.distributionNbPlannedMeals = "";
    scope.distributionDateDayLabel = "lundi";
    scope.distributionDateDayNumber = "04";
    scope.distributionDateMonthLabel = "août";
    scope.distributionDateYear="2014";
    scope.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should be able to retrieve the name of a day based on the date', function () {
    expect(findDayLabel("4", "septembre", "2014")).toEqual("jeudi"); // jour sur un chiffre
    expect(findDayLabel("14", "septembre", "2014")).toEqual("dimanche"); // jour sur deux chiffres
    expect(findDayLabel("12", "août", "2014")).toEqual("mardi"); // mois avec accent
  })

});
