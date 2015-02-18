(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, dataService, commonService, $location) {
    $scope.openBeneficiaireDetail = function () {
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.currentBeneficiaire = dataService.findBeneficiaireById($routeParams.beneficiaireId, $scope.beneficiaires);
      $scope.currentBeneficiaire.codeNumber = Number($scope.currentBeneficiaire.code);
      $scope.getComments();
      $scope.currentBeneficiaire.visiteNumber = $scope.getVisiteNumber($scope.currentBeneficiaire.id);
      // By default, an old user has a card.
      if($scope.currentBeneficiaire.hasCard == undefined){$scope.currentBeneficiaire.hasCard = true;}
    };

    $scope.isBookmark = function (comment) {
      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].distributionId == comment.distributionId && beneficiairesPresentByDistribution[i].beneficiaireId == $scope.currentBeneficiaire.id){
          beneficiairesPresentByDistribution[i].isBookmark = comment.isBookmark;
          break;
        }
      }
      dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
    };

    $scope.getVisiteNumber = function(beneficiaireId) {
      var visiteNumber = 0;
      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if(beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId){
          visiteNumber++;
        }
      }
      return visiteNumber;
    }

    $scope.getComments = function(){
      $scope.currentBeneficiaire.comments = getLastComments($scope.currentBeneficiaire.id, -1, dataService, false);
    }

    $scope.cancelBeneficiaireDetail = function () {
      if ($scope.fromDistribution == true) {
        $scope.loadDistribution($scope.currentDistribution.id, $scope.readOnly);
      } else {
        $scope.openBeneficiaireList();
      }
    };

    $scope.saveBeneficiaireDetail = function () {
      if (commonService.userFormValidation($scope, true)) {
        var beneficiaires = dataService.loadBeneficiaires();
        for (var i = 0; i < beneficiaires.length; i++) {
          if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
            beneficiaires[i] = $scope.currentBeneficiaire;
            break;
          }
        }
        dataService.saveBeneficiaires(beneficiaires);
        $scope.cancelBeneficiaireDetail();
      }
    };

    $scope.deleteBeneficiaireDetail = function () {
      $('#confirmDeletePopup').foundation('reveal', 'open');
    };

    $scope.addCommentaire = function () {
      if($scope.currentBeneficiaire.newComment == undefined || $scope.currentBeneficiaire.newComment.length == 0){
        $scope.currentError = {isCommentEmpty: true};
      }else {
        var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
        var comment = {
          distributionId: -1,
          beneficiaireId: $scope.currentBeneficiaire.id,
          comment: $scope.currentBeneficiaire.newComment,
          date: formatDate(new Date())
        };
        beneficiairesPresentByDistribution.push(comment);
        dataService.saveBeneficiairesPresentByDistribution(beneficiairesPresentByDistribution);
        $scope.getComments();
        $scope.currentBeneficiaire.newComment = null;
      }
    };

    $scope.cancelBeneficiaireDetailDeletePopup = function () {
      $('#confirmDeletePopup').foundation('reveal', 'close');
    }

    $scope.confirmBeneficiaireDetailDeletePopup = function () {
      $('#confirmDeletePopup').foundation('reveal', 'close');
      var beneficiaires = dataService.loadBeneficiaires();
      var beneficiaireToDeletePosition = -1;
      for (var i = 0; i < beneficiaires.length; i++) {
        if (beneficiaires[i].id == $scope.currentBeneficiaire.id) {
          beneficiaireToDeletePosition = i;
          break;
        }
      }
      beneficiaires.splice(beneficiaireToDeletePosition, 1);
      dataService.saveBeneficiaires(beneficiaires);

      var beneficiairesPresentByDistribution = dataService.beneficiairesPresentByDistribution();
      var newBeneficiairesPresentByDistribution = [];
      var beneficiairePresentByDistributionToDeletePosition = -1;
      for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
        if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire.id) {
          newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
        }
      }
      dataService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);

      $scope.cancelBeneficiaireDetail();
    };

    $scope.openBeneficiaireList = function () {
      $location.path("/beneficiaires");
    }

    $scope.openBeneficiaireDetail();
  }

})();
