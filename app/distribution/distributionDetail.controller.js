(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionDetailController', DistributionDetailController);

  function DistributionDetailController ($scope, $routeParams, beneficiairesService, commonService) {

    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope, beneficiaire);
    };

    $scope.showDistribution = function () {
      if($routeParams.distributionId == null){
        return false;
      }
      $scope.numberBeneficiairesPresent = 0;
      $scope.currentDistribution = beneficiairesService.findDistributionById($routeParams.distributionId);
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.beneficiaires = retrieveBeneficiairesByDistribution($scope.currentDistribution.id, beneficiairesService, false).slice(0);
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
      for (var i = 0; i < $scope.beneficiaires.length; i++) {
        $scope.beneficiaires[i].comments = getLastComments($scope.beneficiaires[i].id, $scope.currentDistribution.id, beneficiairesService, true);
      }
    };

    $scope.showDistribution();

    $scope.writeDistributionComment = function (comment) {
      $scope.currentDistribution.comment = comment;
      beneficiairesService.updateDistribution($scope.currentDistribution);
    }
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
    beneficiaires[i].comments = getLastComments(beneficiaires[i].id, distributionId, beneficiairesService, true);
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

/* Get the last 5 comments for distribution showing or all of them for profile page */
getLastComments = function (beneficiaireId, distributionId, beneficiairesService, onlyBookmark) {
  var beneficiaireOldComments = [];
  var allDistributions = beneficiairesService.allDistributions();
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
  beneficiairesPresentByDistribution.reverse();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (distributionId != -1 && beneficiaireOldComments.length == 5) {
      break;
    }
    if (beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId &&
      beneficiairesPresentByDistribution[i].comment != null && ( onlyBookmark == false || onlyBookmark == true && beneficiairesPresentByDistribution[i].isBookmark == true)) {
      beneficiaireOldComments.push({distributionId:beneficiairesPresentByDistribution[i].distributionId,text:getDateDistribution(allDistributions, beneficiairesPresentByDistribution[i], distributionId) + " : " + beneficiairesPresentByDistribution[i].comment, isBookmark: beneficiairesPresentByDistribution[i].isBookmark});
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
