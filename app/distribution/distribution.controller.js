(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionController', DistributionController);

  function DistributionController ($scope, dataService, commonService, $location) {
    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope.searchText, beneficiaire);
    };

    $.datepicker.setDefaults($.datepicker.regional['fr']);

    $scope.currentError = {};
    $scope.dateOptions = {
      dateFormat: 'DD d MM yy'
    };

    $scope.currentDistribution = {};
    $scope.beneficiaires = dataService.loadBeneficiaires();

    $scope.showAllDistribution = function () {
      $scope.distributions = retrieveAllDistribution(dataService);
      $scope.getComments();
      $scope.initNextDate();
    };

    $scope.loadDistribution = function (distributionId) {
      $location.path("/distributions/" + distributionId);
    };

      $scope.getComments = function () {
      if ($scope.distributions != null) {
        var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
        for (var distributionIndex = 0; distributionIndex < $scope.distributions.length; distributionIndex++) {
          for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
            if (beneficiairesPresentByDistribution[i].distributionId == $scope.distributions[distributionIndex].id &&
              beneficiairesPresentByDistribution[i].comment != undefined) {
              if ($scope.distributions[distributionIndex].comments == null) {
                $scope.distributions[distributionIndex].comments = [];
              }
              var beneficiaire = null;
              for (var beneficiaireIndex = 0; beneficiaireIndex < $scope.beneficiaires.length; beneficiaireIndex++) {
                if ($scope.beneficiaires[beneficiaireIndex].id == beneficiairesPresentByDistribution[i].beneficiaireId) {
                  beneficiaire = $scope.beneficiaires[beneficiaireIndex];
                  $scope.distributions[distributionIndex].comments.push("(" + beneficiaire.code + ") " + beneficiaire.lastName + " " + beneficiaire.firstName + " : " + beneficiairesPresentByDistribution[i].comment);
                  break;
                }
              }
            }
          }
        }
      }
    };

    $scope.initNextDate = function () {
      if ($scope.distributions.length > 0) {
        var date = createNextWorkingDate($scope.distributions[0].distributionDate);
        $scope.currentDistribution.distributionDate = formatDate(date);
      }
    };

    $scope.showAllDistribution();

    $scope.startNewDistribution = function () {
      $scope.currentDistribution.id = $scope.saveNewDistribution();
      $location.path('distributions/' + $scope.currentDistribution.id);
    };

    $scope.saveNewDistribution = function () {
      return storeDistribution({
        'distributionDate': $scope.currentDistribution.distributionDate,
        'nbPlannedMeals': $scope.currentDistribution.distributionNbPlannedMeals
      }, dataService);
    };

  }

})();

retrieveAllDistribution = function (dataService) {
  var allDistributions = dataService.allDistributions();
  if (allDistributions == null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  var nbBeneficiaireByDistribution = [];
  var beneficiaire;
  var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    beneficiaire = nbBeneficiaireByDistribution[beneficiairesPresentByDistribution[i].distributionId];
    nbBeneficiaireByDistribution[beneficiairesPresentByDistribution[i].distributionId] = beneficiaire ? beneficiaire + 1 : 1;
  }

  for (var i = 0; i < allDistributions.length; i++) {
    allDistributions[i].nbBeneficiaires = nbBeneficiaireByDistribution[allDistributions[i].id];
  }
  return allDistributions;
};

storeDistribution = function (distribution, dataService) {
  if (distribution.distributionDate === undefined || distribution.distributionDate.length == 0) {
    throw 'merci de renseigner la date';
  }
  if (distribution.nbPlannedMeals === undefined || distribution.nbPlannedMeals.length == 0) {
    throw 'merci de renseigner le nombre de repas';
  }
  var distributions = dataService.allDistributions();
  var nextId;
  if (distributions == null || distributions.length == 0) {
    distributions = [];
    nextId = 1;
  } else if (distributions.filter(function (storedDistribution) {
      return (distribution.distributionDate === storedDistribution.distributionDate);
    }).length > 0) {
    throw 'Une distribution a cette date existe déjà';
  } else {
    nextId = distributions[distributions.length - 1].id + 1;
  }

  distribution.id = nextId;
  distributions.push(distribution);
  dataService.saveDistributions(distributions);
  return nextId;
};

storeRelationDistributionBeneficiaire = function (distributionId, beneficiaireId, dataService) {
  var isRelationExisting = false;
  var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (beneficiairesPresentByDistribution[i].distributionId == distributionId &&
      beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
      isRelationExisting = true;
      beneficiairesPresentByDistribution.splice(i, 1);
      break;
    }
  }
  if (isRelationExisting == false) {
    beneficiairesPresentByDistribution.push({
      "distributionId": distributionId.toString(),
      "beneficiaireId": beneficiaireId
    });
  }
  dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
};

/* get the date of the comment : depending of the source, from the related distribution or from the date of the object */
getDateDistribution = function (allDistributions, beneficiairePresent, distributionId) {
  var dateDistrib = "[DATE]";
  if(beneficiairePresent.distributionId != -1 && beneficiairePresent.distributionId != distributionId) {
    for (var distributionNumber = 0; distributionNumber < allDistributions.length; distributionNumber++) {
      if (allDistributions[distributionNumber].id == beneficiairePresent.distributionId) {
        dateDistrib = allDistributions[distributionNumber].distributionDate;
        break;
      }
    }
  }else{
    if(beneficiairePresent.date != null) {
      dateDistrib = beneficiairePresent.date;
    }
  }
  return dateDistrib;
}

createNextWorkingDate = function (dateString) {
  var lastDate = new Date(dateString);
  var nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
  if (nextDate.getDay() == 0) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  if (nextDate.getDay() == 6) {
    nextDate.setDate(nextDate.getDate() + 2);
  }
  return nextDate;
};
