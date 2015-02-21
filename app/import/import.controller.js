(function () {
  'use strict';

  angular
    .module('mardisDolivier')
    .controller('ImportController', ImportController);

  function ImportController($scope, dataService, $location) {
    $scope.openImportPage = function () {
      $scope.initDynamicVariable("");
      $scope.hasCard = false;
      $scope.showFinalList = false;
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
      $scope.validationImport($scope.parsedPaste);
    });

    $scope.initDynamicVariable = function (parsedList) {
      $scope.parsedPaste = parsedList;
      $scope.currentError = {hasImportError: false};
      $scope.beneficiaires = dataService.loadBeneficiaires();
      $scope.beneficiairesToImport = angular.copy($scope.beneficiaires);
      var lastCode = 0;
      if ($scope.beneficiairesToImport.length > 0) {
        lastCode = $scope.beneficiairesToImport[$scope.beneficiairesToImport.length - 1].code;
      }
      return lastCode;
    };

    $scope.createMissingInformationError = function (lineNumber) {
      $scope.currentError = {importErrorMissingInformation: true, importErrorLine:lineNumber+1};
      return false;
    };

    // If you only paste firstname, lastname and hasCard (optionnal), id is generated
    $scope.validationImport = function (parsedList) {
      var lastCode = $scope.initDynamicVariable(parsedList);

      for (var i = 0; i < parsedList.length; i++) {
        if (parsedList[i].length < 2) {
         return $scope.createMissingInformationError(i);
        }

        lastCode++;
        var code = undefined;
        var lastName = undefined;
        var firstName = undefined;
        var hasCard = $scope.hasCard;
        var isFirstColCode = (/^\d+$/.test(parsedList[i][0]));
        var lastNameIndex = isFirstColCode == false ? 0 : 1;

        if (parsedList[i].length == 2 && (isFirstColCode == true || $scope.getHasCardFromString(parsedList[i][1]) != undefined)) {
          return $scope.createMissingInformationError(i);
        }

        lastName = parsedList[i][lastNameIndex];
        firstName = parsedList[i][lastNameIndex + 1];
        if(lastName.length == 0 || firstName.length == 0) {
          return $scope.createMissingInformationError(i);
        }

        if (parsedList[i].length == 2 || (parsedList[i].length == 3 && isFirstColCode == false)) {
          code = lastCode;
        }

        var hasCardFromString = $scope.getHasCardFromString(parsedList[i][2]);
        if (parsedList[i].length == 3 && isFirstColCode == false){
            if(hasCardFromString == undefined) {
              return $scope.createMissingInformationError(i);
            }
            hasCard = hasCardFromString;
        }

        if (code === undefined) {
          for (var benefNum = 0; benefNum < $scope.beneficiairesToImport.length; benefNum++) {
            if ($scope.beneficiairesToImport[benefNum].code == parsedList[i][0]) {
              $scope.currentError = {importErrorDuplicateCode: true, importErrorFirstDuplicateCode: $scope.beneficiairesToImport[benefNum].code, importErrorLine:i+1};
              return false;
            }
          }
          code = parsedList[i][0];
          hasCard = $scope.getHasCardFromString(parsedList[i][3]);
        }

        $scope.beneficiairesToImport.push(getNewBeneficiaire(getNextId($scope.beneficiairesToImport), code, lastName, firstName, hasCard));
      }
    };

    $scope.getHasCardFromString = function (stringValue) {
      if (stringValue != undefined && stringValue != "true" && stringValue != "false") {
        return undefined;
      }
      if ($scope.hasCard == true) {
        return true;
      }
      return stringValue === "true";
    };

    $scope.openImportPage();
  }

})();

angular
  .module('mardisDolivier')
  .directive('angularPaste', ['$parse', '$document',
    function ($parse, $document) {
      return {
        restrict: 'E',
        link: function ($scope, element, attrs) {

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
                'C': 67,
                'V': 86
              };

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
