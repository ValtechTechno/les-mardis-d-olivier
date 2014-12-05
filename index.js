(function() {
  'use strict';

  var app = angular.module('mardisDolivier', ['ui.date']);

  app.controller('contentCtrl', function($scope, $filter, beneficiairesService) {
    $.datepicker.setDefaults($.datepicker.regional['fr']);
    $scope.numberBeneficiairesPresent = 0;

    $scope.currentPage = { distributionList : true };
    $scope.currentError = {};
    $scope.dateOptions = {
      dateFormat: 'DD d MM yy'
    };

    $scope.currentDistribution = {};
    $scope.currentBeneficiaire = {};
    $scope.readOnly = false;

    $scope.resetAddBeneficiareForm = function(){
      $scope.currentError = {};
    }

    $scope.userFormValidation = function(isUpdate){
      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return (beneficiaire.firstName === $scope.currentBeneficiaire.firstName &&
            beneficiaire.lastName === $scope.currentBeneficiaire.lastName);
      }).length > 0 && isUpdate == false) {
        $scope.currentError = { isBeneficiaireNotUnique: true };
        return false;
      }
      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return (beneficiaire.code === $scope.currentBeneficiaire.code);
      }).length > 0 && isUpdate == false) {
        $scope.currentError = { isCodeNotUnique : true };
        return false;
      }

      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return (beneficiaire.code === $scope.currentBeneficiaire.code && beneficiaire.id !== $scope.currentBeneficiaire.id);
      }).length > 0 && isUpdate == true) {
        $scope.currentError = { isCodeNotUnique : true };
        return false;
      }

      if ($scope.currentBeneficiaire.lastName === undefined || $scope.currentBeneficiaire.lastName.length == 0) {
        return false;
      }
      if ($scope.currentBeneficiaire.firstName === undefined || $scope.currentBeneficiaire.firstName.length == 0) {
        return false;
      }
      return true;
      }

    $scope.addBeneficiaireFromDistribution = function(){
      if($scope.userFormValidation(false)) {
      $scope.addBeneficiaire();
      $scope.resetAddBeneficiareForm();
    }
    }

    $scope.addBeneficiaire = function() {
      var nextId;
      if ($scope.beneficiaires.length == 0) {
        nextId = '1';
      } else {
        nextId = parseInt($scope.beneficiaires[$scope.beneficiaires.length-1].id) + 1 + '';
      }
      var newBeneficiaire = { id:nextId, code:$scope.currentBeneficiaire.code, firstName:$scope.currentBeneficiaire.firstName, lastName:$scope.currentBeneficiaire.lastName, isPresent:true };
      $scope.beneficiaires.push(newBeneficiaire);
      $scope.isPresent(newBeneficiaire);
      $scope.currentBeneficiaire = { code : $scope.initNextCode() };
    };

    $scope.beneficiaires = beneficiairesService.loadBeneficiaires();

    // Specific filter to avoid search in comments
    $scope.searchBeneficiaire  = function (beneficiaire) {
      var reg = new RegExp($scope.searchText, 'i');
      return !$scope.searchText || reg.test(beneficiaire.code.toString()) || reg.test(beneficiaire.lastName) || reg.test(beneficiaire.firstName);
    };

    $scope.$watch('beneficiaires', function(newValue, oldValue) {
      if(newValue.length != oldValue.length && $scope.readOnly == false) {
        var cleanBeneficiairesList = [];
        for (var i = 0; i < $scope.beneficiaires.length; i++) {
          var beneficiaire = $scope.beneficiaires[i];
          cleanBeneficiairesList.push({ id:beneficiaire.id, code:beneficiaire.code, firstName:beneficiaire.firstName, lastName:beneficiaire.lastName});
        }
        beneficiairesService.saveBeneficiaires(cleanBeneficiairesList);
      }
    }, true);

    $scope.showAllDistribution = function() {
      $scope.distributions = retrieveAllDistribution();
      $scope.getComments();
      $scope.initNextDate();
    };

    $scope.getComments = function(){
      if($scope.distributions != null){
        var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
        for (var distributionIndex= 0; distributionIndex < $scope.distributions.length; distributionIndex++) {
          for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
            if (beneficiairesPresentByDistribution[i].distributionId == $scope.distributions[distributionIndex].id &&
                beneficiairesPresentByDistribution[i].comment != undefined) {
              if ($scope.distributions[distributionIndex].comments == null) {
                $scope.distributions[distributionIndex].comments = [];
              }
              var beneficiaire = null;
              for (var beneficiaireIndex= 0; beneficiaireIndex < $scope.beneficiaires.length; beneficiaireIndex++) {
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

    $scope.initNextCode = function() {
      var nextCode = 1;
      if ($scope.beneficiaires != null) {
        for (var i= 0; i < $scope.beneficiaires.length; i++) {
          if (nextCode <= $scope.beneficiaires[i].code) {
            nextCode = $scope.beneficiaires[i].code;
            nextCode++;
          }
        }
      }
      return nextCode;
    };

    $scope.initNextDate = function() {
      if ($scope.distributions.length > 0) {
        var lastDistribution = $scope.distributions[0];
        var date = createNextWorkingDate(lastDistribution.distributionDate);
        var month = (date.getMonth() + 1) + "";
        var pad = "00";
        var paddedMonth = pad.substring(0, pad.length - month.length) + month;
        var day = date.getDate().toString();
        if (day.length == 1) {
          day = "0" + day;
        }
        $scope.currentDistribution.distributionDate = date.getFullYear() + "-" + paddedMonth + "-" + day;
      }
    };

    $scope.showAllDistribution();

    $scope.startNewDistribution = function() {
      try {
        $scope.currentDistribution.id = $scope.saveNewDistribution();
      } catch(err) {
        return;
      }
      $scope.readOnly = false;
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      for (var i= 0; i < $scope.beneficiaires.length; i++) {
        $scope.beneficiaires[i].comments = getLastComments($scope.beneficiaires[i].id, $scope.currentDistribution.id, beneficiairesService);
      }
      $scope.openDistribution();
    };

    $scope.openAboutPage = function () {
      var aboutInformation = angular.fromJson(localStorage.getItem('aboutInformation'));
      if(aboutInformation != null){
        $scope.aboutInformation = aboutInformation;
      }
      $scope.currentPage = { aboutPage : true };

    };

    $scope.openAboutPageUpdate = function () {
      $scope.currentPage = { aboutPageUpdate : true };
    };

    $scope.aboutPageSave = function () {
      localStorage.setItem('aboutInformation', angular.toJson($scope.aboutInformation));
      $scope.openAboutPage();
    };

    $scope.openDistribution = function () {
      if (!$scope.readOnly) {
        $scope.currentBeneficiaire = { code : $scope.initNextCode() };
      }
      $scope.currentPage = { distributionDetail : true };
    };

    $scope.openBeneficiaireList = function () {
      $scope.resetAddBeneficiareForm();
      $scope.beneficiaires = beneficiairesService.loadBeneficiaires();
      $scope.currentBeneficiaire = { code : $scope.initNextCode() };
      $scope.currentPage = { beneficiaireList : true };
    };

    $scope.openBeneficiaireDetail = function (beneficiaire, fromDistribution) {
      $scope.currentBeneficiaire = beneficiaire;
      $scope.fromDistribution = fromDistribution;
      $scope.currentPage = { beneficiaireDetail : true };
    };

    $scope.saveNewDistribution = function() {
      return storeDistribution({
        'distributionDate':$scope.currentDistribution.distributionDate,
        'nbPlannedMeals':$scope.currentDistribution.distributionNbPlannedMeals
      }, beneficiairesService);
    };

    $scope.cancelBeneficiaireDetail = function() {
      if($scope.fromDistribution == true) {
        $scope.loadDistribution($scope.currentDistribution.id, $scope.readOnly, beneficiairesService);
      }else{
        $scope.openBeneficiaireList();
      }
    };

    $scope.saveBeneficiaireDetail = function() {
      if($scope.userFormValidation(true)) {
        var beneficiaires = beneficiairesService.loadBeneficiaires();
        for (var i = 0; i < beneficiaires.length; i++) {
          if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
            beneficiaires[i] = $scope.currentBeneficiaire;
            break;
          }
        }
        beneficiairesService.saveBeneficiaires(beneficiaires);
        $scope.cancelBeneficiaireDetail();
      }
    };

    $scope.deleteBeneficiaireDetail = function() {
      $('#confirmDeletePopup').foundation('reveal', 'open');
    };

    $scope.aboutPageConfirmPopupCancel = function() {
      $('#confirmDeletePopup').foundation('reveal', 'close');
    }

    $scope.aboutPageConfirmPopupSave = function() {
      $('#confirmDeletePopup').foundation('reveal', 'close');
      var beneficiaires = beneficiairesService.loadBeneficiaires();
      var beneficiaireToDeletePosition = -1;
      for (var i= 0; i < beneficiaires.length; i++) {
        if(beneficiaires[i].id == $scope.currentBeneficiaire.id){
          beneficiaireToDeletePosition = i;
          break;
        }
      }
      beneficiaires.splice(beneficiaireToDeletePosition, 1);
      beneficiairesService.saveBeneficiaires(beneficiaires);

      var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
      var newBeneficiairesPresentByDistribution = [];
      var beneficiairePresentByDistributionToDeletePosition = -1;
      for (var i= 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire.id){
          newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
        }
      }
      beneficiairesService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);

      $scope.cancelBeneficiaireDetail();
    };

    $scope.loadDistribution = function(distributionId, readOnly, beneficiairesService) {
      $scope.readOnly = readOnly;
      $scope.currentDistribution = {};
      var allDistributions = beneficiairesService.allDistributions();
      for (var i = 0; i < allDistributions.length; i++) {
        if (allDistributions[i].id == distributionId) {
          $scope.currentDistribution = allDistributions[i];
        }
      }
      $scope.beneficiaires = retrieveBeneficiairesByDistribution($scope.currentDistribution.id, beneficiairesService, $scope.readOnly).slice(0);
      if ($scope.readOnly){
        $scope.numberBeneficiairesPresent = $scope.beneficiaires.length;
      } else {
        $scope.numberBeneficiairesPresent = 0;
        for (var i= 0; i < $scope.beneficiaires.length; i++) {
          if ($scope.beneficiaires[i].isPresent){
            $scope.numberBeneficiairesPresent++;
          }
        }
      }
      $scope.openDistribution();
    };

    $scope.leftCurrentDistribution = function() {
      $scope.currentDistribution = {};
      $scope.resetAddBeneficiareForm();
      $scope.showAllDistribution();
      $scope.currentPage = { distributionList : true };
      $scope.numberBeneficiairesPresent = 0;
    };

    $scope.isPresent = function(beneficiaire) {
      if (!$scope.readOnly) {
        storeRelationDistributionBeneficiaire($scope.currentDistribution.id, beneficiaire.id);
      }
      if (beneficiaire.isPresent){
        $scope.numberBeneficiairesPresent++;
      } else {
        $scope.numberBeneficiairesPresent--;
      }
    };

    $scope.writeComment = function(beneficiaireId, message) {
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
          beneficiairesPresentByDistribution.push({ "distributionId":$scope.currentDistribution.id.toString(), "beneficiaireId":beneficiaireId, "comment":message });
        } else {
          beneficiairesPresentByDistribution.push({ "distributionId":$scope.currentDistribution.id.toString(), "beneficiaireId":beneficiaireId });
        }
        beneficiairesService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
      }
    };
  });

  app.filter('dateWithJQueryUiDatePicker', function() {
    return function(input) {
      return $.datepicker.formatDate("DD d MM yy", new Date(input));
    };
  });

})();

retrieveAllDistribution = function() {
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
}

storeDistribution = function(distribution, beneficiairesService) {
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
}

storeRelationDistributionBeneficiaire = function(distributionId, beneficiaireId) {
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
    beneficiairesPresentByDistribution.push({ "distributionId":distributionId.toString(), "beneficiaireId":beneficiaireId });
  }
  beneficiairesService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
}

retrieveBeneficiairesByDistribution = function(distributionId, beneficiairesService, readOnly) {
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
  for (var i= 0; i < beneficiaires.length; i++) {
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
}

getLastComments = function(beneficiaireId, distributionId, beneficiairesService){
  var beneficiaireOldComments = [];
  var beneficiairesPresentByDistribution = beneficiairesService.beneficiairesPresentByDistribution();
  beneficiairesPresentByDistribution.reverse();
  for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
    if (beneficiaireOldComments.length == 5) {
      break;
    }
    if (beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId &&
        beneficiairesPresentByDistribution[i].distributionId != distributionId &&
        beneficiairesPresentByDistribution[i].comment != null) {
      var dateDistrib = "[DATE]";
      var allDistributions = beneficiairesService.allDistributions();
      for (var distributionNumber = 0; distributionNumber < allDistributions.length; distributionNumber++) {
        if (allDistributions[distributionNumber].id == beneficiairesPresentByDistribution[i].distributionId) {
          dateDistrib = allDistributions[distributionNumber].distributionDate;
          break;
        }
      }
      beneficiaireOldComments.push(dateDistrib + " : " + beneficiairesPresentByDistribution[i].comment);
    }
  }
  return beneficiaireOldComments;
}

createNextWorkingDate = function(dateString) {
  var lastDate = new Date(dateString);
  var nextDate = new Date(lastDate.setDate(lastDate.getDate() + 1));
  if (nextDate.getDay() == 0) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  if (nextDate.getDay() == 6) {
    nextDate.setDate(nextDate.getDate() + 2);
  }
  return nextDate;
}
