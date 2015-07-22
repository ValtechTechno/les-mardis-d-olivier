(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionController', DistributionController);

  function DistributionController ($scope, dataService, commonService, $location, $rootScope) {
    $scope.searchBeneficiaire = function (beneficiaire) {
      return commonService.searchBeneficiaire($scope.searchText, beneficiaire);
    };

    $.datepicker.setDefaults($.datepicker.regional['fr']);

    $scope.dateOptions = {
      dateFormat: 'DD d MM yy'
    };

    $scope.currentDistribution = {};

    $scope.showAllDistribution = function () {
      dataService.findAllDistributionsByAntenneId($rootScope.account.antenneId)
        .then(function (distributions) {
          $scope.distributions = distributions;
          $scope.initNextDate();
          $scope.loadBeneficiaires();
          $scope.loadBeneficiaireByDistribution();
        });
    };

    $scope.loadBeneficiaires = function () {
      dataService.findAllBeneficiairesByAntenneId($rootScope.account.antenneId)
        .then(function (beneficiaires) {
          $scope.beneficiaires = beneficiaires;
        });
    };

    $scope.loadDistribution = function (distributionId) {
      $location.path("/distributions/" + distributionId);
    };

    $scope.initNextDate = function () {
      if ($scope.distributions.length > 0) {
        $scope.distributions.sort(function(a,b){
          return new Date(b.distributionDate) - new Date(a.distributionDate);
        });
        var date = createNextWorkingDate($scope.distributions[0].distributionDate);
        $scope.currentDistribution.distributionDate = formatDate(date);
      }
    };

    $scope.showAllDistribution();

    $scope.startNewDistribution = function () {
      $scope.storeDistribution({
        'distributionDate': $scope.currentDistribution.distributionDate,
        'nbPlannedMeals': $scope.currentDistribution.distributionNbPlannedMeals,
        'antenneId':$rootScope.account.antenneId
      });
    };

    $scope.storeDistribution = function (distribution) {
      // charge all distributions to determine the next id
      dataService.findAllDistributionsByAntenneId($rootScope.account.antenneId)
        .then(function (distributions) {
          if (distributions.filter(function (storedDistribution) {
              return (distribution.distributionDate === storedDistribution.distributionDate);
            }).length > 0) {
            throw {type: "functional", message: 'Une distribution à cette date existe déjà'};
          }
          $scope.addDistribution(distribution);
        })
        .catch(function () {
          throw {
            type: "functional",
            message: 'Impossible de récupérer les distributions.'
          };
        });
    };

    $scope.addDistribution = function (distribution) {
      dataService.addOrUpdateDistribution(distribution).then(function (distributionId) {
        $location.path('distributions/' + distributionId._id);
      }).catch(function () {
        throw {
          type: "functional",
          message: 'Impossible de créer la distribution.'
        };
      });
    };

    $scope.loadBeneficiaireByDistribution = function(){
      dataService.findAllBeneficiaireByDistributionByAntenneId($rootScope.account.antenneId)
        .then(function (beneficiaireByDistribution) {
          $scope.beneficiaireByDistribution = beneficiaireByDistribution;
          $scope.getNbBeneficiairesAndComments();
        })
        .catch(function () {
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
    };
  }
})();

createNextWorkingDate = function (dateString) {
  var lastDate = new Date(dateString);
  var nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
  if (nextDate.getDay() === 0) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  if (nextDate.getDay() === 6) {
    nextDate.setDate(nextDate.getDate() + 2);
  }
  return nextDate;
};
