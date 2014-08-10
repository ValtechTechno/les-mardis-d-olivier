var monthLabels = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

var dayNumbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31'
];

var dayLabels = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi'
];

(function() {
  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  var app = angular.module('mardisDolivier', []);

  app.controller('contentCtrl', function($scope, $filter, Date) {
    $scope.monthLabels = monthLabels;
    $scope.dayNumbers = dayNumbers;
    $scope.currentDistribution = {};
    $scope.currentBeneficiaire = {};
    $scope.readOnly = false;

    $scope.$watch('currentBeneficiaire.lastName', function(newValue, oldValue) {
      $scope.isLastNameEmpty=false;
    }, true);

    $scope.$watch('currentBeneficiaire.firstName', function(newValue, oldValue) {
      $scope.isFirstNameEmpty=false;
    }, true);

    $scope.resetAddBeneficiareForm = function(){
      $scope.isBeneficiaireNotUnique=false;
      $scope.isCodeNotUnique=false;
      $scope.isFirstNameEmpty=false;
      $scope.isLastNameEmpty=false;
      if($scope.addBeneficiaireForm != null) {
        $scope.addBeneficiaireForm.$setPristine();
      }
    }

    $scope.addBeneficiaireFromDistribution = function(){
      $scope.resetAddBeneficiareForm();
      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return ($scope.currentBeneficiaire.code === undefined && beneficiaire.firstName === $scope.currentBeneficiaire.firstName && beneficiaire.lastName === $scope.currentBeneficiaire.lastName) || ($scope.currentBeneficiaire.code !== undefined && beneficiaire.code === $scope.currentBeneficiaire.code);
      }).length > 0) {
        if ($scope.currentBeneficiaire.code === undefined) {
          $scope.isBeneficiaireNotUnique=true;
        }else{
          $scope.isCodeNotUnique=true;
        }
        return;
      }
      if ($scope.currentBeneficiaire.lastName === undefined || $scope.currentBeneficiaire.lastName.length == 0) {
        $scope.isLastNameEmpty=true;
        return;
      }
      if ($scope.currentBeneficiaire.firstName === undefined || $scope.currentBeneficiaire.firstName.length == 0) {
        $scope.isFirstNameEmpty=true;
        return;
      }

      $scope.addBeneficiaire();
      $scope.resetAddBeneficiareForm();
    }

    $scope.addBeneficiaire = function() {
      var nextId;
      if ($scope.beneficiaires.length == 0) {
        nextId = '1';
      }else{
        nextId = parseInt($scope.beneficiaires[$scope.beneficiaires.length-1].id) + 1 + '';
      }
      $scope.beneficiaires.push({ id:nextId, code:$scope.currentBeneficiaire.code, firstName:$scope.currentBeneficiaire.firstName, lastName:$scope.currentBeneficiaire.lastName, isPresent:true });
      $scope.isPresent(nextId);
      $scope.currentBeneficiaire = { code : $scope.initNextCode() };
    };

    $scope.beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
    if ($scope.beneficiaires === null) {
      $scope.beneficiaires = [];
    }

    $scope.$watch('beneficiaires', function(newValue, oldValue) {
      if ($scope.readOnly == false) {
        localStorage.setItem('beneficiaires', angular.toJson($scope.beneficiaires));
      }
    }, true);

    $scope.showAllDistribution = function() {
      $scope.distributions = retrieveAllDistribution();
      $scope.initNextDate();
    };

    $scope.initNextCode = function(){
      var nextCode = 1;
      if($scope.beneficiaires != null){
        for (var i= 0; i < $scope.beneficiaires.length; i++) {
          if(nextCode <= $scope.beneficiaires[i].code ){
            nextCode = $scope.beneficiaires[i].code+1;
          }
        }
      }
      return nextCode;
    };

    $scope.initNextDate = function(){
    	if($scope.distributions.length > 0){
  	      var lastDistribution = $scope.distributions[0];
  	      date = createNextWorkingDate(
            lastDistribution.distributionDateDayNumber,
            monthLabels.indexOf(lastDistribution.distributionDateMonthLabel),
            lastDistribution.distributionDateYear);
  	      $scope.currentDistribution.distributionDateDayNumber = date.getDate().toString();
  	      $scope.currentDistribution.distributionDateMonthLabel = monthLabels[date.getMonth()];
  	      $scope.currentDistribution.distributionDateYear = date.getFullYear().toString();
        }
    };

    $scope.showAllDistribution();

    $scope.startNewDistribution = function() {
      $scope.currentDistribution.distributionDateDayLabel = findDayLabel(
        $scope.currentDistribution.distributionDateDayNumber,
        $scope.currentDistribution.distributionDateMonthLabel,
        $scope.currentDistribution.distributionDateYear);
      $scope.currentDistribution.distributionDateLabel = datePrintFormat(
        $scope.currentDistribution.distributionDateDayLabel,
        $scope.currentDistribution.distributionDateDayNumber,
        $scope.currentDistribution.distributionDateMonthLabel,
        $scope.currentDistribution.distributionDateYear);
      try {
        $scope.currentDistribution.id = $scope.saveNewDistribution();
      } catch(err) {
        return;
      }
      $scope.showAllDistribution();
      $scope.readOnly = false;
      for(var i= 0; i < $scope.beneficiaires.length; i++) {
        $scope.beneficiaires[i].isPresent = false;
      }
      $scope.openDistribution();
    };

    $scope.openDistribution = function () {
      $scope.distributionStarted = true;
      if($scope.readOnly == false){
        $scope.currentBeneficiaire = { code : $scope.initNextCode() };
      }
    }

    $scope.saveNewDistribution = function() {
      return storeDistribution({
        'distributionDateLabel':$scope.currentDistribution.distributionDateLabel,
        'distributionDateDayLabel':$scope.currentDistribution.distributionDateDayLabel,
        'distributionDateDayNumber':$scope.currentDistribution.distributionDateDayNumber,
        'distributionDateMonthLabel':$scope.currentDistribution.distributionDateMonthLabel,
        'distributionDateYear':$scope.currentDistribution.distributionDateYear,
        'nbPlannedMeals':$scope.currentDistribution.distributionNbPlannedMeals
      });
    };

    $scope.loadDistribution = function(distributionId, readOnly) {
      $scope.readOnly = readOnly;
      $scope.currentDistribution = {};
      var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
      for (var i= 0; i < allDistributions.length; i++) {
        if (allDistributions[i].id == distributionId) {
          $scope.currentDistribution = allDistributions[i];
        }
      }
      $scope.beneficiaires = retrieveBeneficiairesByDistribution($scope.currentDistribution.id, $scope.readOnly).slice(0);
      $scope.openDistribution();
    };

    $scope.leftCurrentDistribution = function() {
      $scope.currentDistribution = {};
      $scope.resetAddBeneficiareForm();
      $scope.initNextDate();
      $scope.distributionStarted = false;
    };

    $scope.isPresent = function(beneficiaireId) {
      if ($scope.readOnly == false) {
        storeRelationDistributionBeneficiaire($scope.currentDistribution.id, beneficiaireId);
      }
    };
  });

  app.factory('Date',function() {
    return new Date();
  });

})();

retrieveAllDistribution = function() {
  var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
  if (allDistributions == null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  return allDistributions;
}

storeDistribution = function(distribution) {
  if (
    distribution.distributionDateDayLabel === undefined || distribution.distributionDateDayLabel.length == 0 ||
    distribution.distributionDateDayNumber === undefined || distribution.distributionDateDayNumber.length == 0 ||
    distribution.distributionDateMonthLabel === undefined || distribution.distributionDateMonthLabel.length == 0 ||
    distribution.distributionDateYear === undefined || distribution.distributionDateYear.length == 0
  ) {
    throw 'merci de renseigner la date';
  }
  if (distribution.nbPlannedMeals === undefined || distribution.nbPlannedMeals.length == 0) {
    throw 'merci de renseigner le nombre de repas';
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
    throw 'Une distribution a cette date existe déjà';
  } else {
    nextId = distributions[distributions.length-1].id+1;
  }

  distribution.id = nextId;
  distributions.push(distribution);
  localStorage.setItem('distributions',angular.toJson(distributions));
  return nextId;
}

storeRelationDistributionBeneficiaire = function(distributionId, beneficiaireId) {
  var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
  if (beneficiairesPresentByDistribution == null) {
    beneficiairesPresentByDistribution = [];
  }
  var isRelationExisting = false;
  for (var i= 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (
      beneficiairesPresentByDistribution[i].distributionId == distributionId &&
      beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId
    ) {
      isRelationExisting = true;
      beneficiairesPresentByDistribution.splice(i, 1);
      break;
    }
  }
  if (isRelationExisting == false) {
    beneficiairesPresentByDistribution.push({ "distributionId":distributionId.toString(), "beneficiaireId":beneficiaireId });
  }
  localStorage.setItem('beneficiairesPresentByDistribution',angular.toJson(beneficiairesPresentByDistribution));
}

retrieveBeneficiairesByDistribution = function(distributionId, readOnly) {
  var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
  var beneficiairesPresentIds = [];
  if (beneficiairesPresentByDistribution != null) {
    for (var i= 0; i < beneficiairesPresentByDistribution.length; i++) {
      if (beneficiairesPresentByDistribution[i].distributionId == distributionId) {
        beneficiairesPresentIds.push(beneficiairesPresentByDistribution[i].beneficiaireId);
      }
    }
  }
  var beneficiairesPresent = [];
  var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
  if (beneficiaires != null) {
	  for (var i= 0; i < beneficiaires.length; i++) {
	    if (beneficiairesPresentIds.indexOf(beneficiaires[i].id) != -1) {
	      beneficiaires[i].isPresent = true;
	      beneficiairesPresent.push(beneficiaires[i]);
	    } else {
	      beneficiaires[i].isPresent = false;
	      if (readOnly == false) {
	         beneficiairesPresent.push(beneficiaires[i]);
	      }
	    }
	  }
  }
  return beneficiairesPresent;
}

datePrintFormat = function(dayLabel, dayNumber, monthLabel, year) {
  return dayLabel + ' ' + dayNumber + ' ' + monthLabel + ' ' + year;
}

findDayLabel = function(dayNumber, monthLabel, year) {
  var date = new Date(year, monthLabels.indexOf(monthLabel), dayNumber);
  return dayLabels[date.getDay()];
}

createNextWorkingDate = function(dayNumber, monthNumber, yearNumber) {
	var lastDate = new Date(yearNumber, monthNumber, dayNumber);
	var nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
	 if (nextDate.getDay() == 0) {
		 nextDate.setDate(nextDate.getDate() + 1);
	 }
	 if (nextDate.getDay() == 6) {
		 nextDate.setDate(nextDate.getDate() + 2);
	 }
	 return nextDate;
}
