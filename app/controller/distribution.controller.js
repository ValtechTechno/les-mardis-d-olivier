(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionController', DistributionController);

  function DistributionController ($scope, beneficiairesService, commonService) {

    commonService.init($scope, beneficiairesService);

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope, beneficiaire);
    };

    $.datepicker.setDefaults($.datepicker.regional['fr']);
    $scope.numberBeneficiairesPresent = 0;

    $scope.currentPage = {distributionList: true};
    $scope.currentError = {};
    $scope.dateOptions = {
      dateFormat: 'DD d MM yy'
    };

    $scope.currentDistribution = {};
    $scope.currentBeneficiaire = {};
    $scope.readOnly = false;

    $scope.beneficiaires = beneficiairesService.loadBeneficiaires();

    $scope.showAllDistribution = function () {
      $scope.distributions = retrieveAllDistribution(beneficiairesService);
      $scope.getComments();
      $scope.initNextDate();
    };

    $scope.getComments = function () {
      if ($scope.distributions != null) {
        var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
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
      try {
        $scope.currentDistribution.id = $scope.saveNewDistribution();
      } catch (err) {
        return;
      }
      $scope.readOnly = false;
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      for (var i = 0; i < $scope.beneficiaires.length; i++) {
        $scope.beneficiaires[i].comments = getLastComments($scope.beneficiaires[i].id, $scope.currentDistribution.id, beneficiairesService);
      }
      $scope.openDistribution();
    };

    $scope.openDistribution = function () {
      $scope.currentPage = {distributionDetail: true};
    };

    $scope.saveNewDistribution = function () {
      return storeDistribution({
        'distributionDate': $scope.currentDistribution.distributionDate,
        'nbPlannedMeals': $scope.currentDistribution.distributionNbPlannedMeals
      }, beneficiairesService);
    };

    $scope.loadDistribution = function (distributionId, readOnly) {
      $scope.readOnly = readOnly;
      $scope.currentDistribution = {};
      var allDistributions = beneficiairesService.allDistributions();
      for (var i = 0; i < allDistributions.length; i++) {
        if (allDistributions[i].id == distributionId) {
          $scope.currentDistribution = allDistributions[i];
        }
      }
      $scope.beneficiaires = retrieveBeneficiairesByDistribution($scope.currentDistribution.id, beneficiairesService, $scope.readOnly).slice(0);
      if ($scope.readOnly) {
        $scope.numberBeneficiairesPresent = $scope.beneficiaires.length;
      } else {
        $scope.numberBeneficiairesPresent = 0;
        for (var i = 0; i < $scope.beneficiaires.length; i++) {
          if ($scope.beneficiaires[i].isPresent) {
            $scope.numberBeneficiairesPresent++;
          }
        }
      }
      $scope.openDistribution();
    };

    $scope.writeComment = function (beneficiaireId, message) {
      if (!$scope.readOnly) {
        var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
        for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
          if (beneficiairesPresentByDistribution[i].distributionId == $scope.currentDistribution.id &&
            beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
            beneficiairesPresentByDistribution.splice(i, 1);
            break;
          }
        }
        if (message != null && message.length > 0) {
          beneficiairesPresentByDistribution.push({
            "distributionId": $scope.currentDistribution.id.toString(),
            "beneficiaireId": beneficiaireId,
            "comment": message
          });
        } else {
          beneficiairesPresentByDistribution.push({
            "distributionId": $scope.currentDistribution.id.toString(),
            "beneficiaireId": beneficiaireId
          });
        }
        beneficiairesService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
      }
    };

    $scope.isPresent = function (beneficiaire) {
      if (!$scope.readOnly && $scope.currentDistribution != null) {
        storeRelationDistributionBeneficiaire($scope.currentDistribution.id, beneficiaire.id, beneficiairesService);
      }
      if (beneficiaire.isPresent) {
        $scope.numberBeneficiairesPresent++;
      } else {
        $scope.numberBeneficiairesPresent--;
      }
    };

  }

})();

retrieveAllDistribution = function (beneficiairesService) {
  var allDistributions = beneficiairesService.allDistributions();
  if (allDistributions == null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  var nbBeneficiaireByDistribution = [];
  var beneficiaire;
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    beneficiaire = nbBeneficiaireByDistribution[beneficiairesPresentByDistribution[i].distributionId];
    nbBeneficiaireByDistribution[beneficiairesPresentByDistribution[i].distributionId] = beneficiaire ? beneficiaire + 1 : 1;
  }

  for (var i = 0; i < allDistributions.length; i++) {
    allDistributions[i].nbBeneficiaires = nbBeneficiaireByDistribution[allDistributions[i].id];
  }
  return allDistributions;
};

storeDistribution = function (distribution, beneficiairesService) {
  if (distribution.distributionDate === undefined || distribution.distributionDate.length == 0) {
    throw 'merci de renseigner la date';
  }
  if (distribution.nbPlannedMeals === undefined || distribution.nbPlannedMeals.length == 0) {
    throw 'merci de renseigner le nombre de repas';
  }
  var distributions = beneficiairesService.allDistributions();
  var nextId;
  if (distributions == null) {
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
  beneficiairesService.saveDistributions(distributions);
  return nextId;
};

storeRelationDistributionBeneficiaire = function (distributionId, beneficiaireId, beneficiairesService) {
  var isRelationExisting = false;
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
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
  beneficiairesService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
};

retrieveBeneficiairesByDistribution = function (distributionId, beneficiairesService, readOnly) {
  var beneficiairesPresentIds = [];
  var beneficiairesPresentComments = [];
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (beneficiairesPresentByDistribution[i].distributionId == distributionId) {
      beneficiairesPresentIds.push(beneficiairesPresentByDistribution[i].beneficiaireId);
      beneficiairesPresentComments.push(beneficiairesPresentByDistribution[i].comment);
    }
  }
  var beneficiairesPresent = [];
  var beneficiaires = beneficiairesService.loadBeneficiaires();
  for (var i = 0; i < beneficiaires.length; i++) {
    beneficiaires[i].comments = getLastComments(beneficiaires[i].id, distributionId, beneficiairesService);
    var index = beneficiairesPresentIds.indexOf(beneficiaires[i].id);
    if (index != -1) {
      beneficiaires[i].isPresent = true;
      beneficiaires[i].comment = beneficiairesPresentComments[index];
      beneficiairesPresent.push(beneficiaires[i]);
    } else {
      beneficiaires[i].isPresent = false;
      beneficiaires[i].comment = null;
      if (readOnly == false) {
        beneficiairesPresent.push(beneficiaires[i]);
      }
    }
  }
  return beneficiairesPresent;
};

/* Get the last 5 comments for distribution showing or all of them for profile page */
getLastComments = function (beneficiaireId, distributionId, beneficiairesService) {
  var beneficiaireOldComments = [];
  var allDistributions = beneficiairesService.allDistributions();
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
  beneficiairesPresentByDistribution.reverse();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (distributionId != -1 && beneficiaireOldComments.length == 5) {
      break;
    }
    if (beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId &&
      beneficiairesPresentByDistribution[i].comment != null) {
      beneficiaireOldComments.push(getDateDistribution(allDistributions, beneficiairesPresentByDistribution[i], distributionId) + " : " + beneficiairesPresentByDistribution[i].comment);
    }
  }
  return beneficiaireOldComments;
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
