var monthLabels = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre"
];

var dayNumbers = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31"
];

var dayLabels = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi"
];

(function() {
  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  var app = angular.module('mardisDolivier', ['ngTable']);

  app.controller('contentCtrl', function($scope, $filter, Date, ngTableParams) {
    $scope.monthLabels = monthLabels;
    $scope.dayNumbers = dayNumbers;
    $scope.currentDistribution = {};
    
    $scope.addBeneficiaire = function(firstName, lastName) {
      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return beneficiaire.firstName === firstName && beneficiaire.lastName === lastName;
      }).length > 0) {
        return;
      }
      if (firstName === undefined || firstName.length == 0) {
        return;
      }
      if (lastName === undefined || lastName.length == 0) {
        return;
      }

      var nextCode;
      if ($scope.beneficiaires.length == 0){
        nextCode = '1';
      }else{
        nextCode = parseInt($scope.beneficiaires[$scope.beneficiaires.length-1].code)+1+'';
      }

      $scope.beneficiaires.push({code:nextCode, firstName:firstName, lastName:lastName});
    };

    $scope.beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
    if ($scope.beneficiaires === null) {
      $scope.beneficiaires = [];
    }

    $scope.$watch('beneficiaires', function(newValue, oldValue) {
      localStorage.setItem('beneficiaires', angular.toJson($scope.beneficiaires));
      if(!$scope.beneficiairesTableParams){
        $scope.beneficiairesTableParams.reload();
      }
    }, true);

    $scope.showAllDistribution = function() {
      $scope.distributions = retrieveAllDistribution();
    };
    $scope.showAllDistribution();

    $scope.startNewDistribution = function() {
      $scope.currentDistribution.distributionDateDayLabel = findDayLabel($scope.currentDistribution.distributionDateDayNumber, $scope.currentDistribution.distributionDateMonthLabel, $scope.currentDistribution.distributionDateYear);
      $scope.currentDistribution.distributionDateLabel = datePrintFormat($scope.currentDistribution.distributionDateDayLabel, $scope.currentDistribution.distributionDateDayNumber, $scope.currentDistribution.distributionDateMonthLabel, $scope.currentDistribution.distributionDateYear);
      try {
        $scope.currentDistribution.distributionId = $scope.saveNewDistribution();
      }catch(err){
        alert(err);
        return;
      }
      $scope.showAllDistribution();
      $scope.distributionStarted = true;
    };

    $scope.saveNewDistribution = function() {
      return storeDistribution({
        "distributionDateLabel":$scope.currentDistribution.distributionDateLabel,
        "distributionDateDayLabel":$scope.currentDistribution.distributionDateDayLabel,
        "distributionDateDayNumber":$scope.currentDistribution.distributionDateDayNumber,
        "distributionDateMonthLabel":$scope.currentDistribution.distributionDateMonthLabel,
        "distributionDateYear":$scope.currentDistribution.distributionDateYear,
        "nbPlannedMeals":$scope.currentDistribution.distributionNbPlannedMeals
      });
    };

    $scope.beneficiairesTableParams = new ngTableParams({
      page : 1,
      count : 100,
      filter : {
        code : '',
        lastName : '',
        firstName : ''
      }
    }, {
      total : 100, // length of data
      getData : function($defer, params) {
        var data =  $scope.beneficiaires.slice(0);
        var orderedData = params.filter() ? $filter('filter')(
          data, params.filter()) : data;
        data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve(data);
      }
    });

     $scope.loadDistribution = function(distributionId, readOnly) {
       $scope.currentDistribution = {};
       var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
        for(var i= 0; i < allDistributions.length; i++){
          if(allDistributions[i].id == distributionId){
            $scope.currentDistribution = allDistributions[i];
          }
        }
        if($scope.currentDistribution == {}){
           alert("Impossible d'afficher la distribution.");
        }else{
          $scope.distributionStarted = true;
        }
    };

     $scope.leftCurrentDistribution = function(){
       $scope.currentDistribution = {};
       $scope.distributionStarted = false;
     };

    $scope.updateDayLabel = function(){
      if ($scope.currentDistribution.distributionDateDayNumber === undefined || $scope.currentDistribution.distributionDateDayNumber.length == 0 ||
        $scope.currentDistribution.distributionDateMonthLabel === undefined || $scope.currentDistribution.distributionDateMonthLabel.length == 0 ||
        $scope.currentDistribution.distributionDateYear === undefined || $scope.currentDistribution.distributionDateYear.length == 0
        ){
        $scope.currentDistribution.distributionDateDayLabel = "";
      }else{
        $scope.currentDistribution.distributionDateDayLabel = findDayLabel($scope.currentDistribution.distributionDateDayNumber, $scope.currentDistribution.distributionDateMonthLabel, $scope.currentDistribution.distributionDateYear);
      }
    };

    $scope.isPresent = function(beneficiaireCode){
      storeRelationDistributionBeneficiaire($scope.currentDistribution.distributionId, beneficiaireCode);
    }
  });

  app.factory('Date',function() {
    return new Date();
  });

})();

retrieveAllDistribution = function(){
  var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
  if (allDistributions == null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  return allDistributions;
}

storeDistribution = function(distribution){
  if (distribution.distributionDateDayLabel === undefined || distribution.distributionDateDayLabel.length == 0 ||
    distribution.distributionDateDayNumber === undefined || distribution.distributionDateDayNumber.length == 0 ||
    distribution.distributionDateMonthLabel === undefined || distribution.distributionDateMonthLabel.length == 0 ||
    distribution.distributionDateYear === undefined || distribution.distributionDateYear.length == 0
    ) {
    throw "merci de renseigner la date";
  }
  if (distribution.nbPlannedMeals === undefined || distribution.nbPlannedMeals.length == 0) {
    throw "merci de renseigner le nombre de repas";
  }
  var distributions = angular.fromJson(localStorage.getItem('distributions'));
  var nextId;
  if (distributions == null) {
    distributions = [];
    nextId = 1;
  } else if (distributions.filter(function (storedDistribution) {
    return (
      distribution.distributionDateLabel === storedDistribution.distributionDateLabel &&
        distribution.distributionDateDayLabel === storedDistribution.distributionDateDayLabel &&
        distribution.distributionDateDayNumber === storedDistribution.distributionDateDayNumber &&
        distribution.distributionDateMonthLabel === storedDistribution.distributionDateMonthLabel &&
        distribution.distributionDateYear === storedDistribution.distributionDateYear
      );
  }).length > 0) {
    throw "Une distribution a cette date existe déjà";
  }else{
    nextId = distributions[distributions.length-1].id+1;
  }

  distribution.id = nextId;
  distributions.push(distribution);
  localStorage.setItem('distributions',angular.toJson(distributions));
  return nextId;
}

storeRelationDistributionBeneficiaire = function(distributionId, beneficiaireCode){
  var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
  if (beneficiairesPresentByDistribution == null) {
    beneficiairesPresentByDistribution = [];
  }
  beneficiairesPresentByDistribution.push({"distributionId":distributionId, "beneficiaireCode":beneficiaireCode});
  localStorage.setItem('beneficiairesPresentByDistribution',angular.toJson(beneficiairesPresentByDistribution));
}

retrieveBeneficiairesByDistribution = function(distributionId){
  var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
  if (beneficiairesPresentByDistribution==null){
    return [];
  }
  var codeBeneficiairesPresent = [];
  for(var i= 0; i < beneficiairesPresentByDistribution.length; i++)
  {
    if (beneficiairesPresentByDistribution[i].distributionId == distributionId){
      codeBeneficiairesPresent.push(beneficiairesPresentByDistribution[i].distributionId)
    }
  }
  var beneficiairesPresent = [];
  var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
  for(var i= 0; i < beneficiaires.length; i++)
  {
    if (beneficiaires[i].code == codeBeneficiairesPresent){
      beneficiairesPresent.push(beneficiaires[i]);
    }
  }
  return beneficiairesPresent;
}

datePrintFormat = function(dayLabel, dayNumber, monthLabel, year){
  return dayLabel+" "+dayNumber+" "+monthLabel+" "+year;
}

findDayLabel = function(dayNumber, monthLabel, year){
  var date = new Date(year, monthLabels.indexOf(monthLabel), dayNumber);
  return dayLabels[date.getDay()];
}
