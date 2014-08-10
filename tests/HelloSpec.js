describe("Les Mardis d'Olivier", function() {

  var scope;

  addBeneficiaireWithCode = function(firstName, lastName, code){
    scope.currentBeneficiaire = { code : code };
    scope.currentBeneficiaire.lastName = lastName;
    scope.currentBeneficiaire.firstName = firstName;
    scope.addBeneficiaireFromDistribution();
  }

  addBeneficiaire = function(firstName, lastName){
    addBeneficiaireWithCode(firstName, lastName, scope.initNextCode());
  }

  beforeEach(angular.mock.module('mardisDolivier'));
  beforeEach(function() {
    localStorage.clear()
  });
  beforeEach(angular.mock.inject(function($rootScope, $controller, $filter){
    scope = $rootScope.$new();
    $controller('contentCtrl', {
      $scope: scope,
      $filter: $filter,
      Date: new Date(1981, 11, 24)
    });
    scope.resetAddBeneficiareForm();
    scope.currentBeneficiaire = { code : scope.initNextCode() };
  }));

  it('should add a beneficiaire', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('John', 'Rambo');

    expect(scope.beneficiaires).toContain({ id:'1', code:1, firstName:'John', lastName:'Rambo', isPresent:true });
  });

  it('should add a beneficiaire without code', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaireWithCode('John', 'Rambo', null)

    expect(scope.beneficiaires).toContain({ id:'1', code:null, firstName:'John', lastName:'Rambo', isPresent:true });
  });

  it('calculates the beneficiaire id by incrementing the last id in the list', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('John', 'Rambo');
    addBeneficiaire('Alix', 'Rambo');
    addBeneficiaire('Lana', 'Rambo');

    expect(scope.beneficiaires).toEqual(
      [
        { id:'1', code:1, firstName:'John', lastName:'Rambo', isPresent:true },
        { id:'2', code:2, firstName:'Alix', lastName:'Rambo', isPresent:true },
        { id:'3', code:3, firstName:'Lana', lastName:'Rambo', isPresent:true }
      ]
    );
  });

  it('should not allow to add an existing beneficiaire', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaireWithCode('John', 'Rambo', null);
    addBeneficiaireWithCode('John', 'Rambo', null);

    expect(scope.beneficiaires.length).toBe(1);
  });

  it('should not allow to add a beneficiaire with empty first name or last name', function () {
    scope.currentDistribution.id = 1;

    addBeneficiaire('', '');
    addBeneficiaire('John', '');
    addBeneficiaire('', 'Rambo');

    expect(scope.beneficiaires.length).toBe(0);
  });

  it('should save beneficiaires to localStorage', function () {
    scope.currentDistribution.id = 1;
    scope.$digest();
    addBeneficiaire('foo', 'bar');
    scope.$digest();

    expect(localStorage.getItem('beneficiaires')).toBe('[{"id":"1","code":1,"firstName":"foo","lastName":"bar"}]');
  });

  it("should save a new distribution", function () {
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
    try { scope.saveNewDistribution(); } catch (err) {}

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
  });

  it('should not allow to add a distribution with empty number of meals', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";

    try { scope.saveNewDistribution(); } catch(err) {}

    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should not allow to add a distribution with empty day label', function() {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";

    try{scope.saveNewDistribution();}catch(err){}

    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should not allow to add a distribution with empty day number', function() {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";

    try { scope.saveNewDistribution(); } catch(err) {}

    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should not allow to add a distribution with empty month', function() {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";

    try { scope.saveNewDistribution(); } catch(err) {}

    expect(retrieveAllDistribution()).toEqual([]);
  });

  it('should not allow to add a distribution with empty year', function() {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";

    try { scope.saveNewDistribution(); } catch(err) {}

    expect(retrieveAllDistribution()).toEqual([]);
  });

  it("should be able to init give the next date (working day) of a distribution based on the previous one.", function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "vendredi";
    scope.currentDistribution.distributionDateDayNumber = "8";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "vendredi 8 août 2014";
    scope.startNewDistribution();
    scope.leftCurrentDistribution();
    expect(scope.currentDistribution.distributionDateDayNumber).toEqual("11");
    expect(scope.currentDistribution.distributionDateMonthLabel).toEqual("août");
    expect(scope.currentDistribution.distributionDateYear).toEqual("2014");
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateLabel = "Lundi 11 août 2014";
    scope.startNewDistribution();
    scope.leftCurrentDistribution();
    expect(scope.currentDistribution.distributionDateDayNumber).toEqual("12");
    expect(scope.currentDistribution.distributionDateMonthLabel).toEqual("août");
    expect(scope.currentDistribution.distributionDateYear).toEqual("2014");
  });

  it('should be able to retrieve the name of a day based on the date with a day on one character', function () {
    expect(findDayLabel("4", "septembre", "2014")).toEqual("jeudi");
  });

  it('should be able to retrieve the name of a day based on the date with a day on two character', function () {
    expect(findDayLabel("14", "septembre", "2014")).toEqual("dimanche"); // jour sur deux chiffres
  });

  it('should be able to retrieve the name of a day based on the date with an accent in the month', function () {
    expect(findDayLabel("12", "août", "2014")).toEqual("mardi"); // mois avec accent
  });

  it('should be possible to save beneficiaire presence at a distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.currentDistribution.id = scope.saveNewDistribution();
    scope.$digest();
    addBeneficiaire('John', 'Rambo');
    scope.$digest();

    beneficiaireCode = scope.beneficiaires[0].id;

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id);
    expect(beneficiairesList[0].id).toEqual(beneficiaireCode);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
  });

  it('should return an empty list when the distribution has nobody present', function(){
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.saveNewDistribution();

    expect(retrieveBeneficiairesByDistribution(scope.currentDistribution.distributionId)).toEqual([]);
  });

  it('should be only returns the present beneficiaire from a open distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.startNewDistribution();

    addBeneficiaire('John', 'Rambo');
    scope.$digest();
    addBeneficiaire('Alix', 'Rambo');
    scope.$digest();
    addBeneficiaire('Lana', 'Rambo');
    scope.$digest();

    var beneficiaireId = scope.beneficiaires[1].id;
    scope.isPresent(beneficiaireId);

    scope.leftCurrentDistribution();
    scope.loadDistribution(1, false);

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, false);
    expect(beneficiairesList.length).toEqual(3);
    expect(beneficiairesList[0].isPresent).toEqual(true);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(false);
    expect(beneficiairesList[1].firstName).toEqual('Alix');
    expect(beneficiairesList[2].isPresent).toEqual(true);
    expect(beneficiairesList[2].firstName).toEqual('Lana');
  });

  it('should be only returns the present beneficiaire from a closed distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.startNewDistribution();

    addBeneficiaire('John', 'Rambo');
    scope.$digest();
    addBeneficiaire('Alix', 'Rambo');
    scope.$digest();
    addBeneficiaire('Lana', 'Rambo');
    scope.$digest();

    var beneficiaireId = scope.beneficiaires[1].id;
    scope.isPresent(beneficiaireId);

    scope.leftCurrentDistribution();
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateLabel = "Mardi 05 août 2014";
    scope.startNewDistribution();
    scope.leftCurrentDistribution();

    scope.loadDistribution(2, true);

    var beneficiairesList = retrieveBeneficiairesByDistribution(1, true);
    expect(beneficiairesList.length).toEqual(2);
    expect(beneficiairesList[0].isPresent).toEqual(true);
    expect(beneficiairesList[0].firstName).toEqual('John');
    expect(beneficiairesList[1].isPresent).toEqual(true);
    expect(beneficiairesList[1].firstName).toEqual('Lana');
  });

  it('should be possible to save a comment on a beneficiaire during one distribution', function () {
    scope.currentDistribution.distributionNbPlannedMeals = "50";
    scope.currentDistribution.distributionDateDayLabel = "lundi";
    scope.currentDistribution.distributionDateDayNumber = "04";
    scope.currentDistribution.distributionDateMonthLabel = "août";
    scope.currentDistribution.distributionDateYear="2014";
    scope.currentDistribution.distributionDateLabel = "lundi 04 août 2014";
    scope.currentDistribution.id = scope.saveNewDistribution();
    scope.$digest();
    addBeneficiaire('John', 'Rambo');
    scope.$digest();

    var beneficiaireId = scope.beneficiaires[0].id;
    var comment = "Pas gentil";

    scope.writeComment(beneficiaireId, comment)

    var beneficiairesList = retrieveBeneficiairesByDistribution(scope.currentDistribution.id, true);
    expect(beneficiairesList[0].id).toEqual(beneficiaireId);
    expect(beneficiairesList[0].firstName).toEqual("John");
    expect(beneficiairesList[0].lastName).toEqual("Rambo");
    expect(beneficiairesList[0].comment).toEqual(comment);
  });
});
