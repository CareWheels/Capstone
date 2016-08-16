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
      return 'button-calm';

    var fridge = parseInt(analysis.analysisData.fridgeAlertLevel);
    var meds = parseInt(analysis.analysisData.medsAlertLevel);

    // check for acceptable bounds
    if (meds < 0 || meds > 2 || fridge < 0 || fridge > 2)
      return 'button-calm'; // error state

    else if (fridge == 2 || meds == 2)
      return  'button-assertive';
    else
      return 'button-positive';
 };

  /**
   * This function returns the number of sensor pings to create astericks
   * in the meals and meds columns.
   */
  $scope.returnPings = function(hits) {
    switch(hits) {
    case 0:
      return "";
    case 1:
      return "*";
    case 2:
      return "* *";
    case 3:
      return "* * *";
    case 4:
      return "* * * *";
    case 5:
      return "* * * * *";
    default:
      return "* * * * * * ";
    }
  };

  /**
   * This function displays the number of times a sensor pinged during a
   * partucular hour using the analysis object.
   */
  $scope.getPings = function(time, type) {
    switch(time) {
    case 'midnight':
      if (timeNow >= 0) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[0]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[0]);
        }
      } else {
        return "";
      }
    case 'one':
      if (timeNow >= 1) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[1]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[1]);
        }
      } else {
        return "";
      }
    case 'two':
      if (timeNow >= 2) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[2]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[2]);
        }
      } else {
        return "";
      }
    case 'three':
      if (timeNow >= 3) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[3]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[3]);
        }
      } else {
        return "";
      }
    case 'four':
      if (timeNow >= 4) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[4]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[4]);
        }
      } else {
        return "";
      }
    case 'five':
      if (timeNow >= 5) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[5]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[5]);
        }
      } else {
        return "";
      }
    case 'six':
      if (timeNow >= 6) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[6]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[6]);
        }
      } else {
        return "";
      }
    case 'seven':
      if (timeNow >= 7) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[7]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[7]);
        }
      } else {
        return "";
      }
    case 'eight':
      if (timeNow >= 8) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[8]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[8]);
        }
      } else {
        return "";
      }
    case 'nine':
      if (timeNow >= 9) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[9]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[9]);
        }
      } else {
        return "";
      }
    case 'ten':
      if (timeNow >= 10) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[10]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[10]);
        }
      } else {
        return "";
      }
    case 'eleven':
      if (timeNow >= 11) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[11]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[11]);
        }
      } else {
        return "";
      }
    case 'twelve':
      if (timeNow >= 12) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[12]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[12]);
        }
      } else {
        return "";
      }
    case 'thirteen':
      if (timeNow >= 13) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[13]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[13]);
        }
      } else {
        return "";
      }
    case 'fourteen':
      if (timeNow >= 14) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[14]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[14]);
        }
      } else {
        return "";
      }
    case 'fifteen':
      if (timeNow >= 15) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[15]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[15]);
        }
      } else {
        return "";
      }
    case 'sixteen':
      if (timeNow >= 16) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[16]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[16]);
        }
      } else {
        return "";
      }
    case 'seventeen':
      if (timeNow >= 17) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[17]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[17]);
        }
      } else {
        return "";
      }
    case 'eighteen':
      if (timeNow >= 18) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[18]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[18]);
        }
      } else {
        return "";
      }
    case 'nineteen':
      if (timeNow >= 19) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[19]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[19]);
        }
      } else {
        return "";
      }
    case 'twenty':
      if (timeNow >= 20) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[20]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[20]);
        }
      } else {
        return "";
      }
    case 'twentyone':
      if (timeNow >= 21) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[21]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[21]);
        }
      } else {
        return "";
      }
    case 'twentytwo':
      if (timeNow >= 22) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[22]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[22]);
        }
      } else {
        return "";
      }
    case 'twentythree':
      if (timeNow >= 23) {
        if (type === 'meals'){
          return $scope.returnPings(analysis.analysisData.fridgeHitsByHour[23]);
        }
        else if (type === 'meds'){
          return $scope.returnPings(analysis.analysisData.medsHitsByHour[23]);
        }
      } else {
        return "";
      }
    default:
        return 'error';
    }
  };

  /**
   * This function returns the color to be returned to populate the presence
   * column.
   */
  $scope.returnPresenceColor = function(data) {
    if (data === true) {
      return  "blue";
    } else {
      return "grey";
    }
  };

  /**
   * This function returns the color to be returned to populate the meals/meds
   * columns.
   */
  $scope.returnStatusColor = function(data) {
    if (data === 0) {
      return  "blue";
    } else if (data === 1){
      return "yellow";
    } else {
      return "red";
    }
  };

  /**
   * This function uses the analysis object to populate the meals column for the
   * given times.
   */
  $scope.getMealsStatus = function(time) {
    switch(time) {
    case 'midnight':
      if (timeNow >= 0) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[0]);
      } else {
        return "";
      }
    case 'one':
      if (timeNow >= 1) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[1]);
      } else {
        return "";
      }
    case 'two':
      if (timeNow >= 2) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[2]);
      } else {
        return "";
      }
    case 'three':
      if (timeNow >= 3) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[3]);
      } else {
        return "";
      }
    case 'four':
      if (timeNow >= 4) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[4]);
      } else {
        return "";
      }
    case 'five':
      if (timeNow >= 5) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[5]);
      } else {
        return "";
      }
    case 'six':
      if (timeNow >= 6) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[6]);
      } else {
        return "";
      }
    case 'seven':
      if (timeNow >= 7) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[7]);
      } else {
        return "";
      }
    case 'eight':
      if (timeNow >= 8) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[8]);
      } else {
        return "";
      }
    case 'nine':
      if (timeNow >= 9) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[9]);
      } else {
        return "";
      }
    case 'ten':
      if (timeNow >= 10) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[10]);
      } else {
        return "";
      }
    case 'eleven':
      if (timeNow >= 11) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[11]);
      } else {
        return "";
      }
    case 'twelve':
      if (timeNow >= 12) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[12]);
      } else {
        return "";
      }
    case 'thirteen':
      if (timeNow >= 13) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[13]);
      } else {
        return "";
      }
    case 'fourteen':
      if (timeNow >= 14) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[14]);
      } else {
        return "";
      }
    case 'fifteen':
      if (timeNow >= 15) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[15]);
      } else {
        return "";
      }
    case 'sixteen':
      if (timeNow >= 16) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[16]);
      } else {
        return "";
      }
    case 'seventeen':
      if (timeNow >= 17) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[17]);
      } else {
        return "";
      }
    case 'eighteen':
      if (timeNow >= 18) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[18]);
      } else {
        return "";
      }
    case 'nineteen':
      if (timeNow >= 19) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[19]);
      } else {
        return "";
      }
    case 'twenty':
      if (timeNow >= 20) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[20]);
      } else {
        return "";
      }
    case 'twentyone':
      if (timeNow >= 21) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[21]);
      } else {
        return "";
      }
    case 'twentytwo':
      if (timeNow >= 22) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[22]);
      } else {
        return "";
      }
    case 'twentythree':
      if (timeNow >= 23) {
        return $scope.returnStatusColor(analysis.analysisData.fridgeRollingAlertLevel[23]);
      } else {
        return "";
      }
    default:
        return 'error';
    }
  };

  /**
   * This function uses the analysis object to populate the meds column for the
   * given times.
   */
  $scope.getMedsStatus = function(time) {
    switch(time) {
    case 'midnight':
      if (timeNow >= 0) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[0]);
      } else {
        return "";
      }
    case 'one':
      if (timeNow >= 1) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[1]);
      } else {
        return "";
      }
    case 'two':
      if (timeNow >= 2) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[2]);
      } else {
        return "";
      }
    case 'three':
      if (timeNow >= 3) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[3]);
      } else {
        return "";
      }
    case 'four':
      if (timeNow >= 4) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[4]);
      } else {
        return "";
      }
    case 'five':
      if (timeNow >= 5) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[5]);
      } else {
        return "";
      }
    case 'six':
      if (timeNow >= 6) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[6]);
      } else {
        return "";
      }
    case 'seven':
      if (timeNow >= 7) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[7]);
      } else {
        return "";
      }
    case 'eight':
      if (timeNow >= 8) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[8]);
      } else {
        return "";
      }
    case 'nine':
      if (timeNow >= 9) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[9]);
      } else {
        return "";
      }
    case 'ten':
      if (timeNow >= 10) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[10]);
      } else {
        return "";
      }
    case 'eleven':
      if (timeNow >= 11) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[11]);
      } else {
        return "";
      }
    case 'twelve':
      if (timeNow >= 12) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[12]);
      } else {
        return "";
      }
    case 'thirteen':
      if (timeNow >= 13) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[13]);
      } else {
        return "";
      }
    case 'fourteen':
      if (timeNow >= 14) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[14]);
      } else {
        return "";
      }
    case 'fifteen':
      if (timeNow >= 15) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[15]);
      } else {
        return "";
      }
    case 'sixteen':
      if (timeNow >= 16) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[16]);
      } else {
        return "";
      }
    case 'seventeen':
      if (timeNow >= 17) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[17]);
      } else {
        return "";
      }
    case 'eighteen':
      if (timeNow >= 18) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[18]);
      } else {
        return "";
      }
    case 'nineteen':
      if (timeNow >= 19) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[19]);
      } else {
        return "";
      }
    case 'twenty':
      if (timeNow >= 20) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[20]);
      } else {
        return "";
      }
    case 'twentyone':
      if (timeNow >= 21) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[21]);
      } else {
        return "";
      }
    case 'twentytwo':
      if (timeNow >= 22) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[22]);
      } else {
        return "";
      }
    case 'twentythree':
      if (timeNow >= 23) {
        return $scope.returnStatusColor(analysis.analysisData.medsRollingAlertLevel[23]);
      } else {
        return "";
      }
    default:
        return 'error';
    }
  };

  /**
   * This function uses the analysis object to populate the presence column for the
   * given times.
   */
  $scope.getPresence = function(time) {
    switch(time) {
    case 'midnight':
      if (timeNow >= 0) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[0]);
      } else {
        return "";
      }
    case 'one':
      if (timeNow >= 1) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[1]);
      } else {
        return "";
      }
    case 'two':
      if (timeNow >= 2) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[2]);
      } else {
        return "";
      }
    case 'three':
      if (timeNow >= 3) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[3]);
      } else {
        return "";
      }
    case 'four':
      if (timeNow >= 4) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[4]);
      } else {
        return "";
      }
    case 'five':
      if (timeNow >= 5) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[5]);
      } else {
        return "";
      }
    case 'six':
      if (timeNow >= 6) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[6]);
      } else {
        return "";
      }
    case 'seven':
      if (timeNow >= 7) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[7]);
      } else {
        return "";
      }
    case 'eight':
      if (timeNow >= 8) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[8]);
      } else {
        return "";
      }
    case 'nine':
      if (timeNow >= 9) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[9]);
      } else {
        return "";
      }
    case 'ten':
      if (timeNow >= 10) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[10]);
      } else {
        return "";
      }
    case 'eleven':
      if (timeNow >= 11) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[11]);
      } else {
        return "";
      }
    case 'twelve':
      if (timeNow >= 12) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[12]);
      } else {
        return "";
      }
    case 'thirteen':
      if (timeNow >= 13) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[13]);
      } else {
        return "";
      }
    case 'fourteen':
      if (timeNow >= 14) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[14]);
      } else {
        return "";
      }
    case 'fifteen':
      if (timeNow >= 15) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[15]);
      } else {
        return "";
      }
    case 'sixteen':
      if (timeNow >= 16) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[16]);
      } else {
        return "";
      }
    case 'seventeen':
      if (timeNow >= 17) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[17]);
      } else {
        return "";
      }
    case 'eighteen':
      if (timeNow >= 18) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[18]);
      } else {
        return "";
      }
    case 'nineteen':
      if (timeNow >= 19) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[19]);
      } else {
        return "";
      }
    case 'twenty':
      if (timeNow >= 20) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[20]);
      } else {
        return "";
      }
    case 'twentyone':
      if (timeNow >= 21) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[21]);
      } else {
        return "";
      }
    case 'twentytwo':
      if (timeNow >= 22) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[22]);
      } else {
        return "";
      }
    case 'twentythree':
      if (timeNow >= 23) {
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[23]);
      } else {
        return "";
      }
    default:
        return 'error';
    }
  };
  
  /**
   * This function takes the phone number string returned from Cyclos (which 
   * us in the incorrect format), and it changes the string to a format
   * necessary for making a call. Note: if no phone number is put on the
   * Cyclos server, the number (000) 000-0000 will be inserted. This indicates
   * that the number needs to be placed in the system.
   */
  $scope.getPhoneNumber = function() {
    console.log('hit getPhoneNumber()');
    console.log(analysis);
    var cyclosPhoneNumber = analysis.phoneNumber;

    if (cyclosPhoneNumber == null){
      cyclosPhoneNumber = "+00000000000"
    }

    console.log(cyclosPhoneNumber);
    var callString = "tel:";
    callString = callString + cyclosPhoneNumber.substring(2, 5) + "-" + cyclosPhoneNumber.substring(5, 8) + "-" + cyclosPhoneNumber.substring(8);
    console.log(callString);
    return callString;
  };

  $scope.name = analysis.name;
  $scope.phoneNumber = analysis.phoneNumber;

});
