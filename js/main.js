(function() {
  if (typeof localStorage == 'undefined') {
    alert("localStorage n'est pas supporté, l'application ne fonctionnera pas avec ce navigateur.");
  }

  var app = angular.module('mardisDolivier', ['ngTable']);

  app.controller('contentCtrl', function($scope, $filter, Date, ngTableParams) {
    var today = Date;
    $scope.distributionDate = $filter('date')(today, 'dd/MM/yyyy');

    $scope.addBeneficiaire = function(firstName, lastName) {
      if ($scope.beneficiaires.filter(function (beneficiaire) {
        return beneficiaire.firstName === firstName && beneficiaire.lastName === lastName;
      }).length > 0) {
        return;
      }
      if (firstName === undefined || firstName.length == 0) {
        return;
      }
      if (lastName === undefined || lastName.length == 0) {
        return;
      }
      $scope.beneficiaires.push({code:'', firstName:firstName, lastName:lastName});
    };

    $scope.beneficiaires = angular.fromJson(localStorage.getItem('beneficiaires'));
    if ($scope.beneficiaires === null) {
      $scope.beneficiaires = [];
    }

    $scope.$watch('beneficiaires', function(newValue, oldValue) {
      localStorage.setItem('beneficiaires', angular.toJson($scope.beneficiaires));
      $scope.beneficiairesTableParams.reload();
    }, true);

    $scope.showAllDistribution = function() {
      $scope.distributions = retrieveAllDistribution();
    };
    $scope.showAllDistribution();

    $scope.startNewDistribution = function() {
      try {
        $scope.saveNewDistribution();
      }catch(err){
        alert(err);
        return;
      }
      $scope.showAllDistribution();
      $scope.distributionStarted = true;
    };

    $scope.saveNewDistribution = function() {
      storeDistribution({
        "date":$scope.distributionDate,
        "nbPlannedMeals":$scope.distributionNbPlannedMeals
      });
    };

	$scope.beneficiairesTableParams = new ngTableParams({
		page : 1,
		count : 100,
		filter : {
			code : '',
			lastName : '',
			firstName : '',
		}
	}, {
		total : 100, // length of data
		getData : function($defer, params) {
			var data =  $scope.beneficiaires.slice(0);
			var orderedData = params.filter() ? $filter('filter')(
					data, params.filter()) : data;
					data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

		    params.total(orderedData.length); // set total for recalc pagination
			$defer.resolve(data);
		}
	});
});

  app.factory('Date',function() {
    return new Date();
  });

})();

retrieveAllDistribution = function(){
  var allDistributions = angular.fromJson(localStorage.getItem('distributions'));
  if (allDistributions == null) {
    allDistributions = [];
  } else {
    allDistributions.reverse();
  }
  return allDistributions;
}

storeDistribution = function(distribution){
  if (distribution.date === undefined || distribution.date.length == 0) {
    throw "merci de renseigner la date";
  }
  if (distribution.nbPlannedMeals === undefined || distribution.nbPlannedMeals.length == 0) {
    throw "merci de renseigner le nombre de repas";
  }
  var distributions = angular.fromJson(localStorage.getItem('distributions'));
  if (distributions == null) {
    distributions = [];
  } else if (distributions.filter(function (storedDistribution) {
    return distribution.date === storedDistribution.date;
  }).length > 0) {
    throw "Une distribution a cette date existe déjà";
  }

  distributions.push(distribution);
  localStorage.setItem('distributions',angular.toJson(distributions));
}
