(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('BeneficiaireDetailController', BeneficiaireDetailController);

  function BeneficiaireDetailController ($scope, $routeParams, dataService, commonService, $location) {
    $scope.openBeneficiaireDetail = function () {
      $scope.currentBeneficiaireVisiteNumber = 0;
      dataService.findBeneficiaireById($routeParams.beneficiaireId, $scope.beneficiaires)
      .then(function (doc) {
        $scope.currentBeneficiaire = doc;
        dataService.getCommentsByBeneficiaireId($scope.currentBeneficiaire._id).then(function(bbd){
          $scope.beneficiairesPresentByDistribution = bbd;
          $scope.getComments();
          $scope.currentBeneficiaireVisiteNumber = $scope.getVisiteNumber($scope.currentBeneficiaire._id);
          // By default, an old user has a card.
          if ($scope.currentBeneficiaire.hasCard === undefined) {
            $scope.currentBeneficiaire.hasCard = true;
          }
        });
      }).catch(function (err) {
          if(err.status === 404) {
            $scope.openBeneficiaireList();
            throw {type: "functional", message: 'Le bénéficiaire n\'existe pas.'};
          }
      });
      $scope.deletePopupButtons = [
        {text: "Supprimer", event: "confirmBeneficiaireDetailDeletePopup", close: true, style: "redButton"},
        {text: "Annuler", event: "", close: true, style: ""}
      ];
    };

    $scope.isBookmark = function (bdd) {
      var bbdToUpdate = false;
      for (var i = 0; i < $scope.beneficiairesPresentByDistribution.length; i++) {
        if ($scope.beneficiairesPresentByDistribution[i].distributionId == bdd.distributionId && $scope.beneficiairesPresentByDistribution[i].beneficiaireId == $scope.currentBeneficiaire._id) {
          bbdToUpdate = i;
          break;
        }
      }
      if (bbdToUpdate !== false) {
        if (bdd.isBookmark !== true) {
          delete $scope.beneficiairesPresentByDistribution[i].isBookmark;
        }
        dataService.addOrUpdateBeneficiaireByDistribution($scope.beneficiairesPresentByDistribution[i]).then(function (bbd) {
          $scope.beneficiairesPresentByDistribution[i] = bbd;
        })
      }
    };

    $scope.getVisiteNumber = function(beneficiaireId) {
      var visiteNumber = 0;
      for (var i = 0; i < $scope.beneficiairesPresentByDistribution.length; i++) {
        if($scope.beneficiairesPresentByDistribution[i].beneficiaireId == beneficiaireId){
          visiteNumber++;
        }
      }
      return visiteNumber;
    };

    $scope.getComments = function(){
      var comments = [];
      for (var i = 0; i < $scope.beneficiairesPresentByDistribution.length; i++) {
        if($scope.beneficiairesPresentByDistribution[i].comment === undefined){
          continue;
        }
        comments.push($scope.beneficiairesPresentByDistribution[i]);

      }
      $scope.currentBeneficiaireComments = comments;
    };

    $scope.saveBeneficiaireDetail = function () {
      dataService.loadBeneficiaires().then(function (beneficiaires) {
        $scope.beneficiaires = beneficiaires;
        if (commonService.userFormValidation($scope.beneficiaires, $scope.currentBeneficiaire.lastName, $scope.currentBeneficiaire.firstName, $scope.currentBeneficiaire._id, true)) {
          dataService.addOrUpdateBeneficiaire($scope.currentBeneficiaire).then(function() {
            $scope.openBeneficiaireList();
          }).catch(function (err) {
            if(err.status === 409) {
              throw {type: "functional", message: 'Un utilisateur vient de modifier ce bénéficiaire. Veuillez recharger la page et recommencer.'};
            }
          });
        }
      });
    };

    $scope.$on('confirmBeneficiaireDetailDeletePopup', function () {
      dataService.deleteBeneficiaire($scope.currentBeneficiaire).then(function () {
        var beneficiairesPresentByDistribution = dataService.allBeneficiairesPresentByDistribution();
        var newBeneficiairesPresentByDistribution = [];
        for (var i = 0; i < beneficiairesPresentByDistribution.length; i++) {
          if (beneficiairesPresentByDistribution[i].beneficiaireId != $scope.currentBeneficiaire._id) {
            newBeneficiairesPresentByDistribution.push(beneficiairesPresentByDistribution[i]);
          }
        }
        dataService.saveBeneficiairesPresentByDistribution(newBeneficiairesPresentByDistribution);
        $scope.openBeneficiaireList();
      }).catch(function (err) {
        if (err.status === 409) {
          throw {
            type: "functional",
            message: 'Un utilisateur vient de modifier ce bénéficiaire. Veuillez recharger la page et recommencer.'
          };
        }
      });
    });

    $scope.openBeneficiaireList = function () {
      $location.path("/beneficiaires");
    };

    $scope.openBeneficiaireDetail();
  }

})();
