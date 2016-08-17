/**
 * CareWheels - Individual Status Controller
 *
 */
angular.module('careWheels')

.controller('individualStatusController', function($scope, GroupInfo, PaymentService){

    /**
    * grabs the analysis of the member selected on the previous view
    */
    var analysis = GroupInfo.getMember_new();
  //console.log(analysis); ////////////testing

    var timeNow = new Date().getHours();

    function convertMedsOrMealsAlertLevelToColor(sensorArray) {

      var coloredArray = [];

      for(var i = 0; i < sensorArray.length; i++) {

        if(sensorArray[i] == 0) {
          coloredArray[i] = "blue";
        }

        if(sensorArray[i] == 1) {
          coloredArray[i] = "yellow";
        }

        if(sensorArray[i] == 2) {
          coloredArray[i] = "red";
        }
      }

      return coloredArray;
    }

    function convertPresenceAlertLevelToColor(sensorArray) {

      var coloredArray = [];

      for(var i = 0; i < sensorArray.length; i++) {

        if(sensorArray[i] == false) {
          coloredArray[i] = "grey";
        }

        if(sensorArray[i] == true) {
          coloredArray[i] = "blue";
        }
      }

      return coloredArray;
    }

    function convertHitsToString(hitsArray) {

      var stringArray = [];
      var asterisks = "";

      for(var i = 0; i < hitsArray.length; i++) {

        for(var j = 0; j < hitsArray[i]; j++) {
          if(j > 5) {
            break;
          }

          asterisks += "* ";
        }

        stringArray[i] = asterisks;
        asterisks = "";
      }

      return stringArray;
    }

    $scope.currentHour = new Date().getHours();
    $scope.getNumber = function(num) {
      return new Array(num);
    }

    $scope.data = {

      presence: {
        value: convertPresenceAlertLevelToColor(analysis.analysisData.presenceByHour)
      },

      meals: {
        value: convertMedsOrMealsAlertLevelToColor(analysis.analysisData.fridgeRollingAlertLevel),
        hits: convertHitsToString(analysis.analysisData.fridgeHitsByHour)
      },

      meds: {
        value: convertMedsOrMealsAlertLevelToColor(analysis.analysisData.medsRollingAlertLevel),
        hits: convertHitsToString(analysis.analysisData.medsHitsByHour)
      }

    };



  // console.log("Calling Call Payment:");
  // PaymentService.call(analysis.name, 1.0, 'Red');
  // console.log("Calling sensorDataView Payment:");
  // PaymentService.sensorDataView(1.0, 'Blue');

  /**
   * The following several functions are used to display text on the
   * individualStatus page. This is so that you can check if the page
   * is populating as expected based on the data that was analyzed.
   * To use them paste the following in indiviualStatus.html within
   * the ion-content tag:
   *  <p>{{showMacguffin()}}</p>
   *  <p>{{showName()}}</p>
   *  <p>{{showPhoneNumber()}}</p>
   *  <p>{{showPresence()}}</p>
   *  <p>{{showMeals()}}</p>
   *  <p>{{showMeds()}}</p>
   *  <p>{{showFridgeHits()}}</p>
   *  <p>{{showMedsHits()}}</p>
   *  <p>{{showTime()}}</p>
   */
  $scope.showMacguffin = function() {
    return analysis;
  };

  $scope.showName = function() {
    var test = analysis.name;
    return test;
  };

  $scope.showPhoneNumber = function() {
    var test = analysis.phoneNumber;
    return test;
  };

  $scope.showPresence = function() {
    var test = analysis.analysisData.presenceByHour;
    return test;
  };

  $scope.showMeals = function() {
    var test = analysis.analysisData.fridgeRollingAlertLevel;
    return test;
  };

  $scope.showMeds = function() {
    var test = analysis.analysisData.medsRollingAlertLevel;
    return test;
  };

  $scope.showFridgeHits = function() {
    var test = analysis.analysisData.fridgeHitsByHour;
    return test;
  };

  $scope.showMedsHits = function() {
    var test = analysis.analysisData.medsHitsByHour;
    return test;
  };

  $scope.showTime = function() {
    return timeNow;
  };

  /**
   * This function returns the color for the call button.
   */
  $scope.getCallButtonColor = function() {
    //console.log("getCallButtonColor();", analysis);

    // check for null params
    if (analysis.analysisData.fridgeAlertLevel == null || analysis.analysisData.medsAlertLevel == null)
      return 'button-dark disableCallButton';

    var fridge = parseInt(analysis.analysisData.fridgeAlertLevel);
    var meds = parseInt(analysis.analysisData.medsAlertLevel);

    // check for acceptable bounds
    if (meds < 0 || meds > 2 || fridge < 0 || fridge > 2)
      return 'button-dark disableCallButton'; // error state

    else if (fridge == 2 || meds == 2)
      return  'button-assertive';
    else if (fridge == 1 || meds == 1)
      return 'button-energized';
    else
      return 'button-dark disableCallButton';
 };

  /**
   * This function takes the phone number string returned from Cyclos (which
   * us in the incorrect format), and it changes the string to a format
   * necessary for making a call. Note: if no phone number is put on the
   * Cyclos server, the number (000) 000-0000 will be inserted. This indicates
   * that the number needs to be placed in the system.
   */
  $scope.getPhoneNumber = function() {
    //console.log('hit getPhoneNumber()');
    //console.log(analysis);
    var cyclosPhoneNumber = analysis.phoneNumber;

    if (cyclosPhoneNumber == null){
      cyclosPhoneNumber = "+00000000000"
    }

    //console.log(cyclosPhoneNumber);
    var callString = "tel:";
    callString = callString + cyclosPhoneNumber.substring(2, 5) + "-" + cyclosPhoneNumber.substring(5, 8) + "-" + cyclosPhoneNumber.substring(8);
    //console.log(callString);
    return callString;
  };

  $scope.name = analysis.name;
  $scope.phoneNumber = analysis.phoneNumber;

});
