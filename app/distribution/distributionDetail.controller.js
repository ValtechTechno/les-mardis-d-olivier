(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionDetailController', DistributionDetailController);

  function DistributionDetailController ($routeParams, dataService, commonService, $location) {
    var vm = this;
    vm.numberBeneficiairesPresent = 0;
    vm.currentDistribution = {};
    vm.beneficiaires = [];
    vm.searchText = "";
    vm.writeDistributionComment = writeDistributionComment;
    vm.searchBeneficiaire = searchBeneficiaire;
    vm.isPresent = isPresent;
    vm.writeComment = writeComment;
    vm.activate = activate;
    var GET_DISTRIBUTION_GENERIC_ERROR = 'Impossible de récupérer cette distribution, une erreur technique est survenue.';
    activate();

    function activate() {
      if ($routeParams.distributionId === null) {
        return false;
      }
      dataService.findDistributionById($routeParams.distributionId)
        .then(function (distribution) {
          vm.currentDistribution = distribution;
          fillDistributionBeneficiaires();
        }).catch(function (err) {
          if (err.status === 404) {
            createDistributionErrorWithReturnToList('Cette distribution n\'existe pas.');
          } else {
            createDistributionErrorWithReturnToList(GET_DISTRIBUTION_GENERIC_ERROR);
          }
        });
    }

    function fillDistributionBeneficiaires() {
      dataService.findAllBeneficiaires()
        .then(function (beneficiaires) {
          retrieveBeneficiairesByDistribution(vm.currentDistribution._id, beneficiaires);
        }).catch(function (err) {
          createDistributionErrorWithReturnToList(GET_DISTRIBUTION_GENERIC_ERROR);
        });
    }

    function createDistributionErrorWithReturnToList(message, technical) {
      $location.path("/distributions");
      throw {
        type: technical === true ? "technical" : "functional",
        message: message
      };
    }

    function retrieveBeneficiairesByDistribution(distributionId, beneficiaires) {

      dataService.findAllBeneficiaireByDistribution().then(function (bbd) {
        vm.beneficiairesPresentByDistribution = bbd;

        var distributionIds = [];
        for (var i = 0; i < vm.beneficiairesPresentByDistribution.length; i++) {
          if (vm.beneficiairesPresentByDistribution[i].isBookmark === true) {
            distributionIds.push(vm.beneficiairesPresentByDistribution[i].distributionId);
          }
        }

        findAllBeneficiaireByDistributionByDistributionIdsIds(distributionIds, distributionId, beneficiaires);
      }).catch(function (err) {
        createDistributionErrorWithReturnToList(GET_DISTRIBUTION_GENERIC_ERROR);
      });
    }

    function findAllBeneficiaireByDistributionByDistributionIdsIds(distributionIds, distributionId, beneficiaires) {
      dataService.findDistributionByIds(distributionIds)
        .then(function (distributions) {
          vm.allDistributions = distributions;

          var beneficiairesPresentIds = [];
          var beneficiairesPresentComments = [];

          for (var i = 0; i < vm.beneficiairesPresentByDistribution.length; i++) {
            if (vm.beneficiairesPresentByDistribution[i].distributionId == distributionId) {
              beneficiairesPresentIds.push(vm.beneficiairesPresentByDistribution[i].beneficiaireId);
              beneficiairesPresentComments.push(vm.beneficiairesPresentByDistribution[i].comment);
            }
          }
          var beneficiairesPresent = [];
          for (var pos = 0; pos < beneficiaires.length; pos++) {
            beneficiaires[pos].comments = getLastComments(beneficiaires[pos]._id, distributionId, true);

            var index = beneficiairesPresentIds.indexOf(beneficiaires[pos]._id);
            if (index != -1) {
              beneficiaires[pos].isPresent = true;
              beneficiaires[pos].comment = beneficiairesPresentComments[index];
            } else {
              beneficiaires[pos].isPresent = false;
              beneficiaires[pos].comment = null;
            }
            beneficiairesPresent.push(beneficiaires[pos]);
          }
          vm.beneficiaires = beneficiairesPresent.slice(0);

          var onlyPresent = function (beneficiaire) {
            return beneficiaire.isPresent;
          };

          vm.numberBeneficiairesPresent = vm.beneficiaires.filter(onlyPresent).length;
        }).catch(function (err) {
          createDistributionErrorWithReturnToList(GET_DISTRIBUTION_GENERIC_ERROR);
        });
    }


    function searchBeneficiaire (beneficiaire) {
      return commonService.searchBeneficiaire(vm.searchText, beneficiaire);
    }

    function writeDistributionComment (comment) {
      vm.currentDistribution.comment = comment;
      dataService.addOrUpdateDistribution(vm.currentDistribution).then(function (distribution) {
        vm.currentDistribution = distribution;
      }).catch(function (err) {
        throw {
          type: "functional",
          message: 'Impossible de sauvegarder les modificiations de cette distribution.'
        };
      });
    }

    function writeComment (beneficiaireId, message) {
      var bbdId = false;
      for (var i = 0; i < vm.beneficiairesPresentByDistribution.length; i++) {
        if (vm.beneficiairesPresentByDistribution[i].distributionId == vm.currentDistribution._id &&
          vm.beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
          bbdId = i;
          break;
        }
      }
      if(bbdId === false){
        return false;
      }

      if (message !== null && message.length > 0) {
        vm.beneficiairesPresentByDistribution[i].comment = message;
      } else {
        delete vm.beneficiairesPresentByDistribution[i].comment;
      }
      dataService.addOrUpdateBeneficiaireByDistribution(vm.beneficiairesPresentByDistribution[i]).then(function(bbd){
        vm.beneficiairesPresentByDistribution[i] = bbd;
      });
    }

    function isPresent (beneficiaire) {
      if (vm.currentDistribution !== null) {
        storeRelationDistributionBeneficiaire(vm.currentDistribution._id, beneficiaire._id, dataService);
      }
      if (beneficiaire.isPresent) {
        vm.numberBeneficiairesPresent++;
      } else {
        vm.numberBeneficiairesPresent--;
      }
    }

    /* Get the last 5 comments for distribution showing or all of them for profile page */
    function getLastComments(beneficiaireId, distributionId, onlyBookmark) {
      var beneficiaireOldComments = [];

      vm.beneficiairesPresentByDistribution.reverse();
      for (var i = 0; i < vm.beneficiairesPresentByDistribution.length; i++) {
        if (distributionId != -1 && beneficiaireOldComments.length == 5) {
          break;
        }
        if (vm.beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId &&
          vm.beneficiairesPresentByDistribution[i].comment !== undefined && ( onlyBookmark === false || onlyBookmark === true && vm.beneficiairesPresentByDistribution[i].isBookmark === true)) {
          beneficiaireOldComments.push({distributionId:vm.beneficiairesPresentByDistribution[i].distributionId,text:getDateDistribution(vm.allDistributions, vm.beneficiairesPresentByDistribution[i]) + " : " + vm.beneficiairesPresentByDistribution[i].comment, isBookmark: vm.beneficiairesPresentByDistribution[i].isBookmark});
        }
      }
      return beneficiaireOldComments;
    }

  function storeRelationDistributionBeneficiaire(distributionId, beneficiaireId) {
    var isRelationExisting = false;
    for (var i = 0; i < vm.beneficiairesPresentByDistribution.length; i++) {
      if (vm.beneficiairesPresentByDistribution[i].distributionId == distributionId &&
        vm.beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
        isRelationExisting = i;
        break;
      }
    }
    if (isRelationExisting !== false) {
      dataService.removeBeneficiaireByDistribution(vm.beneficiairesPresentByDistribution[isRelationExisting]).then(function() {
          vm.beneficiairesPresentByDistribution.splice(isRelationExisting, 1);
        }
    );
    }
    if (isRelationExisting === false) {
      dataService.addOrUpdateBeneficiaireByDistribution({
        "distributionId": distributionId.toString(),
        "beneficiaireId": beneficiaireId
      }).then(function(bbd){
        vm.beneficiairesPresentByDistribution.push(bbd);
      });
    }
  }
  }
})();

/* get the date of the comment : depending of the source, from the related distribution or from the date of the object */
getDateDistribution = function (allDistributions, beneficiairePresent) {
  var dateDistrib = formatDate(new Date());
  if (beneficiairePresent.distributionId != -1) {
    for (var distributionNumber = 0; distributionNumber <= allDistributions.length; distributionNumber++) {
      if (allDistributions[distributionNumber]._id == beneficiairePresent.distributionId) {
        dateDistrib = allDistributions[distributionNumber].distributionDate;
        break;
      }
    }
  }else{
    if(beneficiairePresent.date !== null) {
      dateDistrib = beneficiairePresent.date;
    }
  }
  return dateDistrib;
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
