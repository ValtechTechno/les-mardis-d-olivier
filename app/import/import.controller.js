(function () {
  'use strict';

  angular
      .module('mardisDolivier')
      .controller('ImportController', ImportController);

  function ImportController ($scope, dataService, $location) {
    $scope.openImportPage = function () {
      $scope.rawPaste = '';
      $scope.parsedPaste = [];
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.deletePopupButtons = [
        {text: "Supprimer", event: "deleteExistingData", close: true, style: "redButton"},
        {text: "Annuler", event: "", close: true, style: ""}
      ];
    };

    $scope.importData = function () {
      dataService.saveBeneficiaires($scope.beneficiairesToImport);
      $location.path("/beneficiaires");
    };

    $scope.$on('deleteExistingData', function () {
      dataService.saveBeneficiaires(null);
      dataService.saveDistributions(null);
      dataService.saveBeneficiairesPresentByDistribution(null);
      dataService.saveBeneficiairesPresentByDistribution(null);
      $scope.beneficiaires = dataService.loadBeneficiaires();
    });

    $scope.validationImport = function (parsedList) {
      $scope.currentError = {};
      $scope.beneficiairesToImport = dataService.loadBeneficiaires();
      if($scope.beneficiairesToImport == null){
        $scope.beneficiairesToImport = {};
      }
      for (var i = 0; i < parsedList.length; i++) {
        if(parsedList[i].length < 3){
          $scope.currentError = {importErrorMissingInformation: true};
          return false;
        }
        for (var benefNum = 0; benefNum < $scope.beneficiairesToImport.length; benefNum++) {
          if($scope.beneficiairesToImport[benefNum].code == parsedList[i][0]){
            $scope.currentError = {importErrorDuplicateCode: true};
            return false;
          }
        }
        $scope.beneficiairesToImport.push(getNewBeneficiaire(getNextId($scope.beneficiairesToImport), parsedList[i][0], parsedList[i][1], parsedList[i][2]));
      }
      $scope.currentError = {hasImportError:false};
    };

    $scope.openImportPage();
  }

})();

angular
  .module('mardisDolivier')
.directive('angularPaste', ['$parse', '$document',
  function ($parse, $document) {
    return {
      restrict:'E',
      link:function ($scope, element, attrs) {

        function parseTabular(text) {
          //The array we will return
          var toReturn = [];

          try {
            //Pasted data split into rows
            var rows = text.split(/[\n\f\r]/);
            rows.forEach(function (thisRow) {
              var row = thisRow.trim();
              if (row != '') {
                var cols = row.split("\t");
                toReturn.push(cols);
              }
            });
            $scope.validationImport(toReturn);
          }
          catch (err) {
            console.log(err);
            $scope.currentError = {hasImportError: true};
            return null;
          }

          return toReturn;
        }

        function textChanged() {
          var text = $('#myPasteBox').val();
          if (text != '') {
            //We need to change the $scope values
            $scope.$apply(function () {
              if (attrs.ngModel != undefined && attrs.ngModel != '') {
                $parse(attrs.ngModel).assign($scope, text);
              }
              if (attrs.ngArray != undefined && attrs.ngArray != '') {
                var asArray = parseTabular(text);
                if (asArray != null) {
                  $parse(attrs.ngArray).assign($scope, asArray);
                }
              }
            });
          }
        }


        $document.ready(function () {
          //Handles the Ctrl + V keys for pasting
          function handleKeyDown(e, args) {
            if ($('#parsedPaste').is(':visible') && e.which == keyCodes.V && (e.ctrlKey || e.metaKey)) {    // CTRL + V
              //reset value of our box
              $('#myPasteBox').val('');
              //set it in focus so that pasted text goes inside the box
              $('#myPasteBox').focus();
            }
          }

          //We add a text area to the body only if it is not already created by another myPaste directive
          if ($('#myPasteBox').length == 0) {
            $('body').append($('<textarea id=\"myPasteBox\" style=\"position:absolute; left:-1000px; top:-1000px;\"></textarea>'));

            var keyCodes = {
              'C':67,
              'V':86
            }

            //Handle the key down event
            $(document).keydown(handleKeyDown);

            //We will respond to when the textbox value changes
            $('#myPasteBox').bind('input propertychange', textChanged);
          }
          else {
            //We will respond to when the textbox value changes
            $('#myPasteBox').bind('input propertychange', textChanged);
          }
        });
      }
    }
  }]);
