
var app = angular.module('careWheels');
/////////////////////////////////////////////////////////////////////////////////////////
//Controller for Sensor Data Analysis
//Will receive parsed feed data from the injected DataService factory
/////////////////////////////////////////////////////////////////////////////////////////

app.controller('AnalysisCtrl', function($scope, $controller, GroupInfo, moment, notifications) {


  $scope.AnalyzeData = function(){
    var analyzeData = function(){

      $scope.groupData = GroupInfo.groupInfo();
      console.log('contents of $scope.groupData before analysis ', $scope.groupData);


      // Create loop to analyze each members data.
      for(var z = 0; z < $scope.groupData.length; ++z ) {

        var member = $scope.groupData[z];
        var sensorData = GroupInfo.getSensorData(member.username);

        if(sensorData == null) {

          GroupInfo.setAnalysisData(member.username, null)

          console.log("member after analysis", member);
          continue;
        }

        var presenceData = sensorData.Presence;
        var fridgeData = sensorData.Fridge;
        var medsData = sensorData.Meds;

        // console.log("DATA FOR: " + $scope.groupData[z].username + "\n");

        // ********************************************************************************

        // Setup our presence  and fridge matrices
        var w = 0;
        var previousDayPresenceMatrix = [];
        var currentDayPresenceMatrix = [];
        var previousDayPresenceByHour = [];
        var currentDayPresenceByHour = [];
        var previousDayPresenceHitsByHour = [];
        var currentDayPresenceHitsByHour = [];
        var constantPresence = [];
        var previousDayFridgeMatrix = [];
        var currentDayFridgeMatrix = [];
        var currentDayFridgeHitsByHour = [];
        var previousDayFridgeHitsByHour = [];
        var currentDayMedsMatrix = [];
        var previousDayMedsMatrix = [];
        var currentDayMedsHitsByHour = [];
        var previousDayMedsHitsByHour = [];

        var now = new Date();
        var currentHour = now.getHours();
        var currentMin = now.getMinutes();

        var memberObject;

        // Initialize our matrices
        for (w = 0; w < 24; ++w) {
          previousDayPresenceMatrix[w] = [];
          currentDayPresenceMatrix[w] = [];
          previousDayPresenceHitsByHour[w] = 0;
          currentDayPresenceHitsByHour[w] = 0;
          previousDayFridgeMatrix[w] = [];
          currentDayFridgeMatrix[w] = [];
          currentDayFridgeHitsByHour[w] = 0;
          previousDayFridgeHitsByHour[w] = 0;
          previousDayMedsMatrix[w] = [];
          currentDayMedsMatrix[w] = [];
          previousDayMedsHitsByHour[w] = 0;
          currentDayMedsHitsByHour[w] = 0;
          constantPresence[w] = true;
          previousDayPresenceByHour[w] = false;
          currentDayPresenceByHour[w] = false;

          for (var y = 0; y < 60; ++y) {
            previousDayPresenceMatrix[w][y] = false;
            currentDayPresenceMatrix[w][y] = false;
            previousDayFridgeMatrix[w][y] = 0;
            currentDayFridgeMatrix[w][y] = 0;
            previousDayMedsMatrix[w][y] = 0;
            currentDayMedsMatrix[w][y] = 0;
          }

        }

        // Populate our matrices
        // console.log("PRESENCE DATA: " + "\n");

        var presenceMatrices = populateDataMatrix(presenceData, previousDayPresenceMatrix, currentDayPresenceMatrix,
                                                   previousDayPresenceHitsByHour, currentDayPresenceHitsByHour);
        previousDayPresenceMatrix = presenceMatrices.previousDayDataMatrix;
        currentDayPresenceMatrix = presenceMatrices.currentDayDataMatrix;
        previousDayPresenceHitsByHour = presenceMatrices.previousDayHitsByHour;
        currentDayPresenceHitsByHour = presenceMatrices.currentDayHitsByHour;

        // console.log("FRIDGE DATA: " + "\n");

        var fridgeMatrices = populateDataMatrix(fridgeData, previousDayFridgeMatrix, currentDayFridgeMatrix,
                                                 previousDayFridgeHitsByHour, currentDayFridgeHitsByHour);
        previousDayFridgeMatrix = fridgeMatrices.previousDayDataMatrix;
        currentDayFridgeMatrix = fridgeMatrices.currentDayDataMatrix;
        previousDayFridgeHitsByHour = fridgeMatrices.previousDayHitsByHour;
        currentDayFridgeHitsByHour = fridgeMatrices.currentDayHitsByHour;

        // console.log("MEDS DATA: " + "\n");

        var medsMatrices = populateDataMatrix(medsData, previousDayMedsMatrix, currentDayMedsMatrix,
                                              previousDayMedsHitsByHour, currentDayMedsHitsByHour);
        previousDayMedsMatrix = medsMatrices.previousDayDataMatrix;
        currentDayMedsMatrix = medsMatrices.currentDayDataMatrix;
        previousDayMedsHitsByHour = medsMatrices.previousDayHitsByHour;
        currentDayMedsHitsByHour = medsMatrices.currentDayHitsByHour;

        previousDayPresenceByHour = presenceAnalysis(previousDayPresenceMatrix, previousDayPresenceByHour, 23, 59);
        currentDayPresenceByHour = presenceAnalysis(currentDayPresenceMatrix, currentDayPresenceByHour, 13, 59);

        for(w = 0; w < presenceData.length; w++ ) {
        //  console.log("presenceData[" + w + "] " + presenceData[w]);
        }

        /*
        for(w = 0; w < previousDayPresenceByHour.length; w++ ) {
          console.log("previousDayPresenceByHour[" + w + "] " + previousDayPresenceByHour[w]);
        }
        for(w = 0; w < currentDayPresenceByHour.length; w++ ) {
          console.log("currentDayPresenceByHour[" + w + "] " + currentDayPresenceByHour[w]);
        }
        */


        var fridgeIntervalObjectArray = getFridgeIntervals();
        var medsIntervalObjectArray = getMedsIntervals();
        var analysisObject = null;
        var previousDayCurrentHour = 24;
        var currentDayCurrentHour = currentHour;
        // var currentDayCurrentHour = 13;   // Testing value.
        var newFridgeRollingAlertLevel = 0;
        var previousDayFridgeRollingAlertLevelArray = [];
        var currentDayFridgeRollingAlertLevelArray = [];
        var newMedsRollingAlertLevel = 0;
        var previousDayMedsRollingAlertLevelArray = [];
        var currentDayMedsRollingAlertLevelArray = [];

        console.log("medsIntervalObjectArray: ", medsIntervalObjectArray);

        medsIntervalObjectArray.medsIntervalObject2.pointEscalation = GroupInfo.getMedsInterval2(member.username);
        medsIntervalObjectArray.medsIntervalObject3.pointEscalation = GroupInfo.getMedsInterval3(member.username);
        medsIntervalObjectArray.medsIntervalObject4.pointEscalation = GroupInfo.getMedsInterval4(member.username);

        for(w in fridgeIntervalObjectArray) {

          analysisObject = intervalAnalysis(previousDayFridgeMatrix, fridgeIntervalObjectArray[w], previousDayPresenceByHour,
            newFridgeRollingAlertLevel, previousDayFridgeRollingAlertLevelArray, previousDayCurrentHour);

          newFridgeRollingAlertLevel = analysisObject.newRollingAlertLevel;
          previousDayFridgeRollingAlertLevelArray = analysisObject.rollingAlertLevelArray;
        }

        for(w in fridgeIntervalObjectArray) {

          analysisObject = intervalAnalysis(currentDayFridgeMatrix, fridgeIntervalObjectArray[w], currentDayPresenceByHour,
            newFridgeRollingAlertLevel, currentDayFridgeRollingAlertLevelArray, currentDayCurrentHour);

          newFridgeRollingAlertLevel = analysisObject.newRollingAlertLevel;
          currentDayFridgeRollingAlertLevelArray = analysisObject.rollingAlertLevelArray;
        }

        for(w in medsIntervalObjectArray) {

          analysisObject = intervalAnalysis(previousDayMedsMatrix, medsIntervalObjectArray[w], previousDayPresenceByHour,
            newMedsRollingAlertLevel, previousDayMedsRollingAlertLevelArray, previousDayCurrentHour);

          newMedsRollingAlertLevel = analysisObject.newRollingAlertLevel;
          previousDayMedsRollingAlertLevelArray = analysisObject.rollingAlertLevelArray;
        }

        for(w in medsIntervalObjectArray) {

          analysisObject = intervalAnalysis(currentDayMedsMatrix, medsIntervalObjectArray[w], currentDayPresenceByHour,
            newMedsRollingAlertLevel, currentDayMedsRollingAlertLevelArray, currentDayCurrentHour);

          newMedsRollingAlertLevel = analysisObject.newRollingAlertLevel;
          currentDayMedsRollingAlertLevelArray = analysisObject.rollingAlertLevelArray;
        }

        // console.log("newFridgeRollingAlertLevel: " + newFridgeRollingAlertLevel);
        // console.log("previousDayFridgeRollingAlertLevelArray length: " + previousDayFridgeRollingAlertLevelArray.length);
        // console.log("currentDayFridgeRollingAlertLevelArray length: " + currentDayFridgeRollingAlertLevelArray.length);

        /*
        for(w = 0; w < previousDayFridgeRollingAlertLevelArray.length; w++) {
          console.log("previousDayFridgeRollingAlertLevelArray[" + w + "] " + previousDayFridgeRollingAlertLevelArray[w]);
        }
        for(w = 0; w < currentDayFridgeRollingAlertLevelArray.length; w++) {
          console.log("currentDayFridgeRollingAlertLevelArray[" + w + "] " + currentDayFridgeRollingAlertLevelArray[w]);
        }
        for(w = 0; w < previousDayMedsRollingAlertLevelArray.length; w++) {
          console.log("previousDayMedsRollingAlertLevelArray[" + w + "] " + previousDayMedsRollingAlertLevelArray[w]);
        }
        for(w = 0; w < currentDayMedsRollingAlertLevelArray.length; w++) {
          console.log("currentDayMedsRollingAlertLevelArray[" + w + "] " + currentDayMedsRollingAlertLevelArray[w]);
        }
        */

        if(newMedsRollingAlertLevel >= 2) {
          notifications.Create_Notif(0, 0, 0, false, 0);
        }

        if(newFridgeRollingAlertLevel >= 2) {
          notifications.Create_Notif(0, 0, 0, false, 0);
        }


        var analysisData = {

          medsAlertLevel: newMedsRollingAlertLevel,
          medsRollingAlertLevel: currentDayMedsRollingAlertLevelArray,
          medsHitsByHour: currentDayMedsHitsByHour,
          fridgeAlertLevel: newFridgeRollingAlertLevel,
          fridgeRollingAlertLevel: currentDayFridgeRollingAlertLevelArray,
          fridgeHitsByHour: currentDayFridgeHitsByHour,
          presenceByHour: currentDayPresenceByHour
        };

        // *******************************************************************************


        GroupInfo.setAnalysisData(member.username, analysisData);
        console.log("member after analysis ", member);
        console.log("group after analysis ", GroupInfo.groupInfo());
      }
    };

    analyzeData();
    //console.log('contents of $scope.groupData in Analysis', $scope.groupData);

  };

  // sensorDataArray - The sensor data feed array to use as input when creating
//                   the previous and current day matrices for that sensor.
// previousDayDataMatrix - The 24x60 element array that will hold the sensor data pings
//                         derived from the sensorDataArray values.
// currentDayDataMatrix - The 24x60 element array that will hold the sensor data pings
//                          derived from the sensorDataArray values.
  function populateDataMatrix(sensorDataArray, previousDayDataMatrix, currentDayDataMatrix,
                              previousDayHitsByHour, currentDayHitsByHour) {

    var utcDateTime;
    var momentInLA;
    var losAngelesDateTime;
    var hour;
    var min;
    var currentDate = new Date();
    var previousDate = new Date();

    previousDate.setDate(previousDate.getDate() - 1);

    // Populate our matrices
    for (var w = 0; w < sensorDataArray.length; ++w) {
      // Need to convert dateEvent's from UTC time to Los Angeles time!
      // this needs to be made configurable once the app moves out of PST/PDT areas!!!
      // console.log(sensorDataArray[w].dateEvent);
      utcDateTime = new Date(sensorDataArray[w].dateEvent);
      // console.log("Presence UTC Time Date String: " + utcDateTime.toISOString());
      momentInLA = moment.tz(utcDateTime.toISOString(), "America/Los_Angeles");
      losAngelesDateTime = new Date(momentInLA.format('YYYY-MM-DD[T]HH:mm:ss'));
      hour = losAngelesDateTime.getUTCHours();
      min = losAngelesDateTime.getUTCMinutes();

      // console.log(hour + ":" + min + " " + losAngelesDateTime.getUTCDate() + "\n");

      if (currentDate.isSameDateAs(losAngelesDateTime)) {
        // console.log("Found CURRENT day ping! current date: " + currentDate.toISOString());
        // console.log("los angeles date time date: " + losAngelesDateTime.toISOString());
        currentDayDataMatrix[hour][min] = true;
        currentDayHitsByHour[hour] += 1;
      }
      else if(previousDate.isSameDateAs(losAngelesDateTime)) {
        // console.log("Found previous day ping! previous date: " + previousDate.toISOString());
        // console.log("los angeles date time date: " + losAngelesDateTime.toISOString());
        previousDayDataMatrix[hour][min] = true;
        previousDayHitsByHour[hour] += 1;
      }
    }

    var dataMatrices = {

      previousDayDataMatrix: previousDayDataMatrix,
      currentDayDataMatrix: currentDayDataMatrix,
      previousDayHitsByHour: previousDayHitsByHour,
      currentDayHitsByHour: currentDayHitsByHour
    };

    return dataMatrices;
  }

// preseneMatrix - presenceMatrix containing the presence pings should be
//                 two dimensional from 24 x 60 elements
// presenceByHour - presenceByHour array that will have values added to it
//                  after calculation of the members presence during an hour
//                  should have 24 elements.
// currentHour - The current hour, used so we don't produce data for an hour
//               that hasn't occured yet. Should be 24 when calculating the
//               previous day.
// currentMin - The current minute, used so we don't produce data for a minute
//              that hasn't occured yet. Should be 59 when calculating the
//              previous day.
  function presenceAnalysis(presenceMatrix, presenceByHour, currentHour, currentMin) {

    //Presence of user pre-current hour: at end of hour, Displayed analysis as prescribed by
    // Claude should look at the status of the user "at the end of the hour"
    // Due to sensor timing this will need to be a bit fuzzy.
    for (var w = 0; w < currentHour; ++w) {

      if (presenceMatrix[w][57] || presenceMatrix[w][58] || presenceMatrix[w][59]) {
        presenceByHour[w] = true;
      }
    }

    // Display of presence for current hour, should be the "True" presence of the user.
    // Still need to go fuzzy, as we can't rely on a sensor ping to be in the current minute.
    // Edge case of any hour between 0 to 3 min into that hour.
    if (currentMin < 3 && currentHour != 0) {
      if (presenceMatrix[currentHour - 1][57] || presenceMatrix[currentHour - 1][58] || presenceMatrix[currentHour - 1][59]) {
        presenceByHour[currentHour] = true;
      }
    }
    // Very edge case of 12:00am to 12:03am
    if (currentMin < 3 && currentHour == 0) {
      presenceByHour[currentHour] = true;
    }

    // Normal case, do a fuzzy check for presence.
    if (presenceMatrix[currentHour][currentMin - 2] || presenceMatrix[currentHour][currentMin - 1] ||
      presenceMatrix[currentHour][currentMin]) {
      presenceByHour[currentHour] = true;
    }

    return presenceByHour;
  }


// sensorDataMatrix - The [23][59] array that holds sensor data pings.
// intervalA
// intervalObject - An object that describes the properties of an interval
// presenceByHourArray - The [24] element array that contains the true or false
//                     values for a persons calculated presence during an hour.
// newRollingAlertLevel - An integer expressing the corresponding sensor alert level at the time of
//                        calling this function.
// rollingAlertLevelArra - The [24] element array of integers representing the sensor alert level during
//                         the corresponding hour.
// currentHour - integer of the current hour in 24 time format.
//               Set to current hour for present day and
//               24 when analyzing previous day.
  function intervalAnalysis(sensorDataMatrix, intervalObject, presenceByHourArray, newRollingAlertLevel,
                            rollingAlertLevelArray, currentHour) {

    var pingDuringInterval = false;

    // Lets check on what the suspect is doing between the hours of this interval.
    for (var w = intervalObject.intervalStartAtHour; w < intervalObject.intervalEndBeforeHour; w++) {

      if (w <= currentHour) {
        for (var z = 0; z < sensorDataMatrix[w].length; z++) {

          // HEY THEY'RE ALIVE! THAT'S GREAT!
          // OR
          // The person was gone during one of the hours. Lets assume they
          // "did stuff" while they were gone.
          if (sensorDataMatrix[w][z] > 0) {
            pingDuringInterval = true;
          }
        }

        // If there was a ping during the interval
        // we need to completely reset the rolling
        // alert level.
        if (pingDuringInterval) {
          newRollingAlertLevel = 0;
        }
        // We are only going to copy over the previous alert levels
        // DURING the interval, since we can't escalate until
        // the interval has passed and they haven't caused a ping.
        rollingAlertLevelArray[w] = newRollingAlertLevel;
      }
    }


    // Now that we have passed the interval we can
    // increase the alert level if needed.
    // But only escalate if: a) There was no ping during the hour,
    //                       b) The member was at home during that hour.
    //                       c) This interval has point escalation set to true.
    if ((currentHour >= intervalObject.intervalEndBeforeHour) && intervalObject.pointEscalation &&
      !pingDuringInterval && presenceByHourArray[w] == true) {

      // Well if they didn't produce a ping during the interval,
      // and they didn't leave during that interval,
      // and we are past the interval, let's increase their
      // rolling alert level.
      console.log("No ping in interval increasing alert level!");
      newRollingAlertLevel += intervalObject.alertPointIncrement;
    }

    var intervalValues = {

      newRollingAlertLevel: newRollingAlertLevel,
      rollingAlertLevelArray: rollingAlertLevelArray,
      pingDuringInterval: pingDuringInterval

    };

    return intervalValues;
  }

// Placeholder for fridge interval storage,
// Should be moved to a file or database in the future.
  function getFridgeIntervals() {

    var fridgeIntervalObject1 = {
      intervalStartAtHour: 0,
      intervalEndBeforeHour: 6,
      pointEscalation: false,
      pingClearsAlertLevel: true,
      alertPointIncrement: 1
    };

    var fridgeIntervalObject2 = {
      intervalStartAtHour: 6,
      intervalEndBeforeHour: 11,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 1
    };

    var fridgeIntervalObject3 = {
      intervalStartAtHour: 11,
      intervalEndBeforeHour: 16,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 1
    };

    var fridgeIntervalObject4 = {
      intervalStartAtHour: 16,
      intervalEndBeforeHour: 22,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 1
    };

    var fridgeIntervalObject5 = {
      intervalStartAtHour: 22,
      intervalEndBeforeHour: 24,
      pointEscalation: false,
      pingClearsAlertLevel: true,
      alertPointIncrement: 1
    };

    var fridgeIntervalObjectArray = {

      fridgeIntervalObject1: fridgeIntervalObject1,
      fridgeIntervalObject2: fridgeIntervalObject2,
      fridgeIntervalObject3: fridgeIntervalObject3,
      fridgeIntervalObject4: fridgeIntervalObject4,
      fridgeIntervalObject5: fridgeIntervalObject5
    };

    return fridgeIntervalObjectArray;
  }

// Placeholder for Medication interval storage,
// Should be moved to a file or database in the future.
  function getMedsIntervals() {

    var medsIntervalObject1 = {
      intervalStartAtHour: 0,
      intervalEndBeforeHour: 6,
      pointEscalation: false,
      pingClearsAlertLevel: true,
      alertPointIncrement: 2
    };

    var medsIntervalObject2 = {
      intervalStartAtHour: 6,
      intervalEndBeforeHour: 11,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 2
    };

    var medsIntervalObject3 = {
      intervalStartAtHour: 11,
      intervalEndBeforeHour: 16,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 2
    };

    var medsIntervalObject4 = {
      intervalStartAtHour: 16,
      intervalEndBeforeHour: 22,
      pointEscalation: true,
      pingClearsAlertLevel: true,
      alertPointIncrement: 2
    };

    var medsIntervalObject5 = {
      intervalStartAtHour: 22,
      intervalEndBeforeHour: 24,
      pointEscalation: false,
      pingClearsAlertLevel: true,
      alertPointIncrement: 2
    };

    var medsIntervalObjectArray = {

      medsIntervalObject1: medsIntervalObject1,
      medsIntervalObject2: medsIntervalObject2,
      medsIntervalObject3: medsIntervalObject3,
      medsIntervalObject4: medsIntervalObject4,
      medsIntervalObject5: medsIntervalObject5
    };

    return medsIntervalObjectArray;
  }

// Checks if two dats have the same UTC year, month, and day.
// nDate - Date object to compare to the current Date object.
  Date.prototype.isSameDateAs = function(pDate) {
    // console.log("this.getFullYear() " + this.getFullYear() + "===" + "nDate.getUTCFullYear() " + pDate.getFullYear());
    // console.log("this.getMonth() " + this.getMonth() + "===" + "nDate.getUTCMonth( " + pDate.getMonth());
    // console.log("this.getDate() " + this.getDate() + "===" + "nDate.getUTCDate() " + pDate.getDate());

    return (
    this.getUTCFullYear() === pDate.getUTCFullYear() &&
    this.getUTCMonth() === pDate.getUTCMonth() &&
    this.getUTCDate() === pDate.getUTCDate()
    );
  };

});
