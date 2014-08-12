(function() {
  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  var app = angular.module('mardisDolivier', ['ui.date']);

  app.controller('contentCtrl', function($scope, $filter, Date) {
    $.datepicker.setDefaults($.datepicker.regional['fr']);
    $scope.dateOptions = {
        dateFormat: 'DD d MM yy'
    };

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
      $scope.isBeneficiaireNotUnique = false;
      $scope.isCodeNotUnique = false;
      $scope.isFirstNameEmpty = false;
      $scope.isLastNameEmpty = false;
      if ($scope.addBeneficiaireForm != null) {
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

    $scope.beneficiaires = loadBeneficiaires();

    $scope.$watch('beneficiaires', function(newValue, oldValue) {
      if(newValue.length != oldValue.length && $scope.readOnly == false) {
        var cleanBeneficiairesList = [];
        for (var i= 0; i < $scope.beneficiaires.length; i++) {
          var beneficiaire = $scope.beneficiaires[i];
          cleanBeneficiairesList.push({ id:beneficiaire.id, code:beneficiaire.code, firstName:beneficiaire.firstName, lastName:beneficiaire.lastName});
        }
        localStorage.setItem('beneficiaires', angular.toJson(cleanBeneficiairesList));
      }
    }, true);

    $scope.showAllDistribution = function() {
      $scope.distributions = retrieveAllDistribution();
      $scope.getComments();
      $scope.initNextDate();
    };

    $scope.getComments = function(){
      if($scope.distributions != null){
        var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
        if (beneficiairesPresentByDistribution == null) {
          beneficiairesPresentByDistribution = [];
        }
        for (var distributionIndex= 0; distributionIndex < $scope.distributions.length; distributionIndex++) {
          for (var i= 0; i < beneficiairesPresentByDistribution.length; i++) {
            if (beneficiairesPresentByDistribution[i].distributionId == $scope.distributions[distributionIndex].id && beneficiairesPresentByDistribution[i].comment != undefined) {
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
            nextCode = $scope.beneficiaires[i].code+1;
          }
        }
      }
      return nextCode;
    };

    $scope.initNextDate = function() {
      if ($scope.distributions.length > 0) {
        var lastDistribution = $scope.distributions[0];
        date = createNextWorkingDate(lastDistribution.distributionDate);
        var month = (date.getMonth() + 1) + "";
        var pad = "00";
        var paddedMonth = pad.substring(0, pad.length - month.length) + month;
        $scope.currentDistribution.distributionDate = date.getFullYear() + "-" + paddedMonth + "-" + date.getDate();
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
      $scope.beneficiaires = loadBeneficiaires();
      $scope.openDistribution();
    };

    $scope.openDistribution = function () {
      $scope.distributionStarted = true;
      if (!$scope.readOnly) {
        $scope.currentBeneficiaire = { code : $scope.initNextCode() };
      }
    };

    $scope.saveNewDistribution = function() {
      return storeDistribution({
        'distributionDate':$scope.currentDistribution.distributionDate,
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
      $scope.showAllDistribution();
      $scope.distributionStarted = false;
    };

    $scope.isPresent = function(beneficiaireId) {
      if (!$scope.readOnly) {
        storeRelationDistributionBeneficiaire($scope.currentDistribution.id, beneficiaireId);
      }
    };

    $scope.writeComment = function(beneficiaireId, message) {
      if (!$scope.readOnly) {
        var beneficiairesPresentByDistribution = angular.fromJson(localStorage.getItem('beneficiairesPresentByDistribution'));
        if (beneficiairesPresentByDistribution == null) {
          beneficiairesPresentByDistribution = [];
        }
        for (var i=0; i < beneficiairesPresentByDistribution.length; i++) {
          if (
            beneficiairesPresentByDistribution[i].distributionId == $scope.currentDistribution.id &&
            beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId
          ) {
            beneficiairesPresentByDistribution.splice(i, 1);
            break;
          }
        }
        if (message != null && message.length > 0) {
          beneficiairesPresentByDistribution.push({ "distributionId":$scope.currentDistribution.id.toString(), "beneficiaireId":beneficiaireId, "comment":message });
        } else {
          beneficiairesPresentByDistribution.push({ "distributionId":$scope.currentDistribution.id.toString(), "beneficiaireId":beneficiaireId });
        }
        localStorage.setItem('beneficiairesPresentByDistribution',angular.toJson(beneficiairesPresentByDistribution));
      }
    };
  });

  app.factory('Date',function() {
    return new Date();
  });

  app.filter('dateWithJQueryUiDatePicker', function() {
    return function(input) {
      return $.datepicker.formatDate("DD d MM yy", new Date(input));
    };
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
  if (distribution.distributionDate === undefined || distribution.distributionDate.length == 0) {
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
      distribution.distributionDate === storedDistribution.distributionDate
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
  var beneficiairesPresentComments = [];
  if (beneficiairesPresentByDistribution != null) {
    for (var i= 0; i < beneficiairesPresentByDistribution.length; i++) {
      if (beneficiairesPresentByDistribution[i].distributionId == distributionId) {
        beneficiairesPresentIds.push(beneficiairesPresentByDistribution[i].beneficiaireId);
        beneficiairesPresentComments.push(beneficiairesPresentByDistribution[i].comment);
      }
    }
  }
  var beneficiairesPresent = [];
  var beneficiaires = loadBeneficiaires();
  for (var i= 0; i < beneficiaires.length; i++) {
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

loadBeneficiaires = function() {
  var beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
  if (beneficiaires === null) {
    beneficiaires = [];
  }
  return beneficiaires;
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
