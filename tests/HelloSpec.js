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

    expect(scope.beneficiaires).toContain({code:'1', firstName:'John',lastName:'Rambo'});
  });

  it('calculates the beneficiaire code by incrementing the last code in the list', function () {
    scope.addBeneficiaire('John', 'Rambo');
    scope.addBeneficiaire('Micheline', 'Rambo');
    scope.addBeneficiaire('Pierrot', 'Rambo');
    expect(scope.beneficiaires).toEqual(
      [
        { code : '1', firstName : 'John', lastName : 'Rambo' },
        { code : '2', firstName : 'Micheline', lastName : 'Rambo' },
        { code : '3', firstName : 'Pierrot', lastName : 'Rambo' }
      ]
    );
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

    expect(localStorage.getItem('beneficiaires')).toBe('[{"code":"1","firstName":"foo","lastName":"bar"}]');
  });

  it("is is possible to save a new distribution", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear = "2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "mardi";
    scope.currentDistribution.distributionDateDayNumber = "05";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear = "2014";
    scope.currentDistribution.distributionDateLabel = "mardi 05 août 2014";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution())
      .toEqual([
        {
          "distributionDateLabel":"mardi 05 août 2014",
          "distributionDateDayLabel":"mardi",
          "distributionDateDayNumber":"05",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50",
          id : 2
        },
        {
          "distributionDateLabel":"lundi 04 août 2014",
          "distributionDateDayLabel":"lundi",
          "distributionDateDayNumber":"04",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50",
          id : 1
        }
      ]);
  });

  it("calculates the distribution id by incrementing the last id in the list", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear = "2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "mardi";
    scope.currentDistribution.distributionDateDayNumber = "05";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear = "2014";
    scope.currentDistribution.distributionDateLabel = "mardi 05 août 2014";
    scope.saveNewDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "mercredi";
    scope.currentDistribution.distributionDateDayNumber = "06";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear = "2014";
    scope.currentDistribution.distributionDateLabel = "mercredi 06 août 2014";
    scope.saveNewDistribution();
    expect(retrieveAllDistribution())
      .toEqual([
        {
          "distributionDateLabel":"mercredi 06 août 2014",
          "distributionDateDayLabel":"mercredi",
          "distributionDateDayNumber":"06",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50",
          id : 3
        },
        {
          "distributionDateLabel":"mardi 05 août 2014",
          "distributionDateDayLabel":"mardi",
          "distributionDateDayNumber":"05",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50",
          id : 2
        },
        {
          "distributionDateLabel":"lundi 04 août 2014",
          "distributionDateDayLabel":"lundi",
          "distributionDateDayNumber":"04",
          "distributionDateMonthLabel":"août",
          "distributionDateYear":"2014",
          "nbPlannedMeals":"50",
          id : 1
        }
      ]);
  });

  it("shouldn't be possible to save two distribution at the same date", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();
    try{scope.saveNewDistribution();}catch(err){}

    expect(retrieveAllDistribution())
      .toEqual([{
        "distributionDateLabel":"lundi 04 août 2014",
        "distributionDateDayLabel":"lundi",
        "distributionDateDayNumber":"04",
        "distributionDateMonthLabel":"août",
        "distributionDateYear":"2014",
        "nbPlannedMeals":"50",
        id : 1
      }]);
  })

  it('should not allow to add a distribution with empty date or number of meals', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    scope.currentDistribution.distributionNbPlannedMeals = "";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    try{scope.saveNewDistribution();}catch(err){}
    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should be able to retrieve the name of a day based on the date', function () {
    expect(findDayLabel("4", "septembre", "2014")).toEqual("jeudi"); // jour sur un chiffre
    expect(findDayLabel("14", "septembre", "2014")).toEqual("dimanche"); // jour sur deux chiffres
    expect(findDayLabel("12", "août", "2014")).toEqual("mardi"); // mois avec accent
  })

  it('should be possible to save the info that a beneficiaire is present to a distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.currentDistribution.distributionId = scope.saveNewDistribution();
    scope.addBeneficiaire('John', 'Rambo');
    scope.$digest();

    beneficiaireCode = scope.beneficiaires[0].code;

    scope.isPresent(beneficiaireCode);

    expect(retrieveBeneficiairesByDistribution(scope.currentDistribution.distributionId)).toEqual([{"code":beneficiaireCode,"firstName":"John","lastName":"Rambo"}]);
  })

  it('should return an empty list when the distribution has nobody present', function(){
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();

    expect(retrieveBeneficiairesByDistribution(scope.currentDistribution.distributionId)).toEqual([]);
  })

  it('should be only returns the present beneficiaire from a distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.currentDistribution.distributionId = scope.saveNewDistribution();
    scope.addBeneficiaire('John', 'Rambo');
    scope.addBeneficiaire('Michel', 'Rambo');
    scope.$digest();

    beneficiaireCode = scope.beneficiaires[0].code;

    scope.isPresent(beneficiaireCode);
    expect(retrieveBeneficiairesByDistribution(scope.currentDistribution.distributionId)).toEqual([{"code":beneficiaireCode,"firstName":"John","lastName":"Rambo"}]);
  })
});
