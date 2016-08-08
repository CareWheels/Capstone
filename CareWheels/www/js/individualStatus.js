/**
 * CareWheels - Individual Status Controller
 *
 */
angular.module('careWheels')

.controller('individualStatusController', function($scope, GroupInfo){

  /**
   * grabs the analysis of the member selected on the previous view
   *
   * note:
   *  this object is exactly the same as you were previously using.
   *  also i tested that this is working, by using the analysis object
   *  to change the name(line 338), so now the header will display the name
   *  of whomever was clicked
   */
  var analysis = GroupInfo.getMember_new();
  //console.log(analysis); ////////////testing

  /**
   * The following several functions are used to display text on the 
   * individualStatus page. This is so that you can check if the page
   * is populating as expected based on the data that was analyzed.
   * To use them paste the following in indiviualStatus.html within
   * the ion-content tag:
   *  <p>{{showMacguffin()}}</p>
   *  <p>{{showName()}}</p>
   *  <p>{{showPresence ()}}</p>
   *  <p>{{showFridgeHits()}}</p>
   *  <p>{{showMedsHits()}}</p>
   */
  $scope.showMacguffin = function() {
    return analysis;
  };

  $scope.showName = function() {
    var test = analysis.name;
    return test;
  };

  $scope.showPresence = function() {
    var test = analysis.analysisData.presenceByHour;
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
  
  /**
   * This function will display the number of times a sensor pinged
   * during a partucular hour.
   * It is currently not linked to anything because the current
   * analysis is not set up for this.
   */
  $scope.getPings = function(time, type) {
    switch(time) {
    case 'midnight':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'one':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'two':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'three':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'four':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'five':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'six':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'seven':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'eight':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'nine':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'ten':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'eleven':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twelve':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'thirteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'fourteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'fifteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'sixteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'seventeen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'eighteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'nineteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twenty':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentyone':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentytwo':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentythree':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
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
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[0]);
    case 'one':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[1]);
    case 'two':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[2]);
    case 'three':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[3]);
    case 'four':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[4]);
    case 'five':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[5]);
    case 'six':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[6]);;
    case 'seven':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[7]);
    case 'eight':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[8]);
    case 'nine':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[9]);
    case 'ten':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[10]);
    case 'eleven':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[11]);
    case 'twelve':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[12]);
    case 'thirteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[13]);
    case 'fourteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[14]);
    case 'fifteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[15]);
    case 'sixteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[16]);
    case 'seventeen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[17]);
    case 'eighteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[18]);
    case 'nineteen':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[19]);
    case 'twenty':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[20]);
    case 'twentyone':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[21]);
    case 'twentytwo':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[22]);
    case 'twentythree':
        return $scope.returnStatusColor(analysis.analysisData.fridgeHitsByHour[23]);
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
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[0]);
    case 'one':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[1]);
    case 'two':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[2]);
    case 'three':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[3]);
    case 'four':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[4]);
    case 'five':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[5]);
    case 'six':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[6]);;
    case 'seven':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[7]);
    case 'eight':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[8]);
    case 'nine':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[9]);
    case 'ten':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[10]);
    case 'eleven':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[11]);
    case 'twelve':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[12]);
    case 'thirteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[13]);
    case 'fourteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[14]);
    case 'fifteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[15]);
    case 'sixteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[16]);
    case 'seventeen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[17]);
    case 'eighteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[18]);
    case 'nineteen':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[19]);
    case 'twenty':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[20]);
    case 'twentyone':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[21]);
    case 'twentytwo':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[22]);
    case 'twentythree':
        return $scope.returnStatusColor(analysis.analysisData.medsHitsByHour[23]);
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
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[0]);
    case 'one':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[1]);
    case 'two':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[2]);
    case 'three':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[3]);
    case 'four':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[4]);
    case 'five':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[5]);
    case 'six':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[6]);;
    case 'seven':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[7]);
    case 'eight':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[8]);
    case 'nine':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[9]);
    case 'ten':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[10]);
    case 'eleven':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[11]);
    case 'twelve':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[12]);
    case 'thirteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[13]);
    case 'fourteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[14]);
    case 'fifteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[15]);
    case 'sixteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[16]);
    case 'seventeen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[17]);
    case 'eighteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[18]);
    case 'nineteen':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[19]);
    case 'twenty':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[20]);
    case 'twentyone':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[21]);
    case 'twentytwo':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[22]);
    case 'twentythree':
        return $scope.returnPresenceColor(analysis.analysisData.presenceByHour[23]);
    default:
        return 'error';
    }
  };


  $scope.name = analysis.name;
});
