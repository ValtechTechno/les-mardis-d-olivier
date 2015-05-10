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

    $scope.dateOptions = {
      dateFormat: 'DD d MM yy'
    };

    $scope.currentDistribution = {};

    $scope.showAllDistribution = function () {
      dataService.allDistributions()
        .then(function (distributions) {
          $scope.distributions = retrieveAllDistribution(distributions, dataService);
          $scope.initNextDate();
          $scope.loadBeneficiaires();
          $scope.loadBeneficiaireByDistribution();
        });
    };

    $scope.loadBeneficiaires = function () {
      dataService.loadBeneficiaires()
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
          //$scope.getComments();
        });
    };

    $scope.loadDistribution = function (distributionId) {
      $location.path("/distributions/" + distributionId);
    };

    //$scope.getComments = function () {
    //  if ($scope.distributions === null) {
    //    return false;
    //  }
    //  var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
    //  for (var distributionIndex = 0; distributionIndex < $scope.distributions.length; distributionIndex++) {
    //    for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    //      if (beneficiairesPresentByDistribution[i].distributionId == $scope.distributions[distributionIndex]._id &&
    //        beneficiairesPresentByDistribution[i].comment !== undefined) {
    //        if ($scope.distributions[distributionIndex].comments === undefined) {
    //          $scope.distributions[distributionIndex].comments = [];
    //        }
    //        var beneficiaire = null;
    //        for (var beneficiaireIndex = 0; beneficiaireIndex < $scope.beneficiaires.length; beneficiaireIndex++) {
    //          if ($scope.beneficiaires[beneficiaireIndex]._id == beneficiairesPresentByDistribution[i].beneficiaireId) {
    //            beneficiaire = $scope.beneficiaires[beneficiaireIndex];
    //            $scope.distributions[distributionIndex].comments.push("(" + beneficiaire.code + ") " + beneficiaire.lastName + " " + beneficiaire.firstName + " : " + beneficiairesPresentByDistribution[i].comment);
    //            break;
    //          }
    //        }
    //      }
    //    }
    //  }
    //};

    $scope.initNextDate = function () {
      if ($scope.distributions.length > 0) {
        var date = createNextWorkingDate($scope.distributions[0].distributionDate);
        $scope.currentDistribution.distributionDate = formatDate(date);
      }
    };

    $scope.showAllDistribution();

    $scope.startNewDistribution = function () {
      $scope.storeDistribution({
        'distributionDate': $scope.currentDistribution.distributionDate,
        'nbPlannedMeals': $scope.currentDistribution.distributionNbPlannedMeals
      });
    };

    $scope.storeDistribution = function (distribution) {
      dataService.allDistributions()
        .then(function (distributions) {
          var nextId;
          if (distributions.filter(function (storedDistribution) {
              return (distribution.distributionDate === storedDistribution.distributionDate);
            }).length > 0) {
            throw {type: "functional", message: 'Une distribution à cette date existe déjà'};
          }
          nextId = distributions.length + 1;
          distribution._id = nextId;
          $scope.addDistribution(distribution);
        })
        .catch(function (err) {
          throw {
            type: "functional",
            message: 'Impossible de récupérer les distributions.'
          };
        });
    };

    $scope.addDistribution = function (distribution) {
      dataService.addOrUpdateDistribution(distribution).then(function () {
        $scope.currentDistribution._id = distribution._id;
        $location.path('distributions/' + $scope.currentDistribution._id);
      }).catch(function (err) {
        throw {
          type: "functional",
          message: 'Impossible de créer la distribution.'
        };
      });
    };

    $scope.loadBeneficiaireByDistribution = function(){
      dataService.allBeneficiaireByDistribution()
        .then(function (beneficiaireByDistribution) {
          $scope.beneficiaireByDistribution = beneficiaireByDistribution;
          $scope.getNbBeneficiairesAndComments();
        })
        .catch(function (err) {
          throw {
            type: "functional",
            message: 'Impossible de récupérer les informations des distributions.'
          };
        });
    };

    $scope.getNbBeneficiairesAndComments = function() {
      var nbBeneficiaireByDistribution = [];
      var beneficiaire, comments;
      for (var i = 0; i < $scope.beneficiaireByDistribution.length; i++) {
          if(nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId] === undefined){
            nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId] = {};
          }
          beneficiaire = nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbBeneficiaires;
          comments = nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbComments;
          console.log("comments  => "+comments);
          nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbBeneficiaires = beneficiaire ? beneficiaire + 1 : 1;

        console.log("comment  => "+$scope.beneficiaireByDistribution[i].comment);
          if($scope.beneficiaireByDistribution[i].comment !== undefined) {
            nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbComments = comments ? comments + 1 : 1;
            console.log("comments  => "+nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbComments);
          }
      }

      for (var pos = 0; pos < $scope.distributions.length; pos++) {
        if(nbBeneficiaireByDistribution[$scope.distributions[pos]._id] !== undefined) {
          $scope.distributions[pos].nbBeneficiaires = nbBeneficiaireByDistribution[$scope.distributions[pos]._id].nbBeneficiaires;
          $scope.distributions[pos].nbComments = nbBeneficiaireByDistribution[$scope.distributions[pos]._id].nbComments;
        }
      }
    }
  }
})();

retrieveAllDistribution = function (allDistributions, dataService) {
  if (allDistributions === null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  return allDistributions;
};

storeRelationDistributionBeneficiaire = function (distributionId, beneficiaireId, dataService) {
  var isRelationExisting = false;
  var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (beneficiairesPresentByDistribution[i].distributionId == distributionId &&
      beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
      isRelationExisting = true;
      beneficiairesPresentByDistribution.splice(i, 1);
      break;
    }
  }
  if (isRelationExisting === false) {
    beneficiairesPresentByDistribution.push({
      "distributionId": distributionId.toString(),
      "beneficiaireId": beneficiaireId
    });
  }
  dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
};

createNextWorkingDate = function (dateString) {
  var lastDate = new Date(dateString);
  var nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
  if (nextDate.getDay() === 0) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  if (nextDate.getDay() == 6) {
    nextDate.setDate(nextDate.getDate() + 2);
  }
  return nextDate;
};
