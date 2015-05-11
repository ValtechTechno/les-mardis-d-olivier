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
      dataService.findAllDistributions()
        .then(function (distributions) {
          $scope.distributions = retrieveAllDistribution(distributions, dataService);
          $scope.initNextDate();
          $scope.loadBeneficiaires();
          $scope.loadBeneficiaireByDistribution();
        });
    };

    $scope.loadBeneficiaires = function () {
      dataService.findAllBeneficiaires()
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
        });
    };

    $scope.loadDistribution = function (distributionId) {
      $location.path("/distributions/" + distributionId);
    };

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
      // charge all distributions to determine the next id
      dataService.findAllDistributions()
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
      dataService.findAllBeneficiaireByDistribution()
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
          nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbBeneficiaires = beneficiaire ? beneficiaire + 1 : 1;

          if($scope.beneficiaireByDistribution[i].comment !== undefined) {
            nbBeneficiaireByDistribution[$scope.beneficiaireByDistribution[i].distributionId].nbComments = comments ? comments + 1 : 1;
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
