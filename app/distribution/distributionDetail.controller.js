(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('DistributionDetailController', DistributionDetailController);

  function DistributionDetailController ($routeParams, dataService, commonService) {
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

    activate();

    function activate () {
      if ($routeParams.distributionId === null) {
        return false;
      }
      vm.currentDistribution = dataService.findDistributionById($routeParams.distributionId);
      vm.numberBeneficiairesPresent = 0;
      vm.beneficiaires = dataService.loadBeneficiaires();
      vm.beneficiaires = retrieveBeneficiairesByDistribution(vm.currentDistribution._id, dataService).slice(0);
      var onlyPresent = function (beneficiaire) {
        return beneficiaire.isPresent;
      };
      vm.numberBeneficiairesPresent = vm.beneficiaires.filter(onlyPresent).length;
      for (var i = 0; i < vm.beneficiaires.length; i++) {
        vm.beneficiaires[i].comments = getLastComments(vm.beneficiaires[i]._id, vm.currentDistribution._id, dataService, true);
      }
    }

    function searchBeneficiaire (beneficiaire) {
      return commonService.searchBeneficiaire(vm.searchText, beneficiaire);
    }

    function writeDistributionComment (comment) {
      vm.currentDistribution.comment = comment;
      dataService.updateDistribution(vm.currentDistribution);
    }

    function writeComment (beneficiaireId, message) {
      var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if (beneficiairesPresentByDistribution[i].distributionId == vm.currentDistribution._id &&
          beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId) {
          beneficiairesPresentByDistribution.splice(i, 1);
          break;
        }
      }
      if (message !== null && message.length > 0) {
        beneficiairesPresentByDistribution.push({
          "distributionId": vm.currentDistribution._id.toString(),
          "beneficiaireId": beneficiaireId,
          "comment": message
        });
      } else {
        beneficiairesPresentByDistribution.push({
          "distributionId": vm.currentDistribution._id.toString(),
          "beneficiaireId": beneficiaireId
        });
      }
      dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
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
  }

})();

retrieveBeneficiairesByDistribution = function (distributionId, dataService) {
  var beneficiairesPresentIds = [];
  var beneficiairesPresentComments = [];
  var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (beneficiairesPresentByDistribution[i].distributionId == distributionId) {
      beneficiairesPresentIds.push(beneficiairesPresentByDistribution[i].beneficiaireId);
      beneficiairesPresentComments.push(beneficiairesPresentByDistribution[i].comment);
    }
  }
  var beneficiairesPresent = [];
  var beneficiaires = dataService.loadBeneficiaires();
  for (var pos = 0; pos < beneficiaires.length; pos++) {
    beneficiaires[pos].comments = getLastComments(beneficiaires[pos]._id, distributionId, dataService, true);
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
  return beneficiairesPresent;
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

/* Get the last 5 comments for distribution showing or all of them for profile page */
getLastComments = function (beneficiaireId, distributionId, dataService, onlyBookmark) {
  var beneficiaireOldComments = [];
  var allDistributions = dataService.allDistributions();
  var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
  beneficiairesPresentByDistribution.reverse();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (distributionId != -1 && beneficiaireOldComments.length == 5) {
      break;
    }
    if (beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId &&
      beneficiairesPresentByDistribution[i].comment !== undefined && ( onlyBookmark === false || onlyBookmark === true && beneficiairesPresentByDistribution[i].isBookmark === true)) {
      beneficiaireOldComments.push({distributionId:beneficiairesPresentByDistribution[i].distributionId,text:getDateDistribution(allDistributions, beneficiairesPresentByDistribution[i]) + " : " + beneficiairesPresentByDistribution[i].comment, isBookmark: beneficiairesPresentByDistribution[i].isBookmark});
    }
  }
  return beneficiaireOldComments;
};

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
