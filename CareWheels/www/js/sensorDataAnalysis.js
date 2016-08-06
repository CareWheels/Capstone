var app = angular.module('careWheels')
/////////////////////////////////////////////////////////////////////////////////////////
//Controller for Sensor Data Analysis
//Will receive parsed feed data from the injected DataService factory
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('AnalysisCtrl', function($scope, $controller, GroupInfo, moment) {

  $scope.AnalyzeData = function(){
    var testFunc = function(){

      $scope.groupData = GroupInfo.groupInfo();
      console.log('contents of $scope.groupData before analysis ', $scope.groupData);

      // Excluding Medication analysis for now
      // since we don't know how we are going to handle it.


      // Create loop to analyze each members data.
      for(var z = 0; z < $scope.groupData.length; ++z ) {

        // Setup our presence  and fridge matrices
        var w = 0;
        var presenceMatrix = [];
        var constantPresence = [];
        var presenceByHour = [];
        var fridgeMatrix = [];
        var fridgeHitsByHour = [];
        var fridgeInterval1StartHour = 6;
        var fridgeInterval2StartHour = 11;
        var fridgeInterval3StartHour = 16;
        var fridgeAlertInterval1 = true;
        var fridgeAlertInterval2 = true;
        var fridgeAlertInterval3 = true;
        var fridgeAlertPoints = 0;
        var fridgeAlertLevel = 0;
        var medsMatrix = [];
        var medsHitsByHour = [];
        var medsInterval1StartHour = 6;
        var medsInterval2StartHour = 11;
        var medsInterval3StartHour = 16;
        var medsAlertInterval1 = true;
        var medsAlertInterval2 = true;
        var medsAlertInterval3 = true;
        var medsAlertPoints = 0;
        var medsAlertLevel = 0;
        var now = new Date();
        var currentHour = now.getHours();
        var currentMin = now.getMinutes();
        var analysisData;
        var utcDateTime;
        var momentInParis;
        var momentInLA;
        var losAngelesDateTime;
        var hour;
        var min;
        var memberObject;

        if($scope.groupData[z].sensorData == null) {

          $scope.groupData[z].analysisData = null;
          memberObject = $scope.groupData[z];
          console.log("member after analysis", memberObject);
          GroupInfo.addDataToGroup(memberObject, z);
          GroupInfo.groupInfo();
          continue;
        }


        var presenceData = $scope.groupData[z].sensorData.Presence;
        var fridgeData = $scope.groupData[z].sensorData.Fridge;
        var medsData = $scope.groupData[z].sensorData.Meds;

        console.log("DATA FOR: " + $scope.groupData[z].username + "\n");

        // Initialize our matrices
        for(w = 0; w < 24; ++w) {
          presenceMatrix[w] = [];
          fridgeMatrix[w] = [];
          fridgeHitsByHour[w] = 0;
          medsMatrix[w] = [];
          medsHitsByHour[w] = 0;
          constantPresence[w] = true;
          presenceByHour[w] = false;

          for(var y = 0; y < 60; ++y) {
            presenceMatrix[w][y] = false;
            fridgeMatrix[w][y] = 0;
            medsMatrix[w][y] = 0;
          }

        }

        console.log("PRESENCE DATA: " + "\n");

        // Populate our matrices
        for(w = 0; w < presenceData.length; ++w) {
          // Need to convert dateEvent's from Paris time to Los Angeles time!
          // this needs to be made configurable once the app moves out of PST/PDT areas!!!
          utcDateTime = new Date(presenceData[w].dateEvent);
          momentInLA = moment.tz(utcDateTime.toISOString(), "America/Los_Angeles");
          losAngelesDateTime = new Date(momentInLA.format('YYYY-MM-DD[T]HH:mm:ss'));
          hour = losAngelesDateTime.getHours();
          min = losAngelesDateTime.getMinutes();

          console.log(hour + ":" + min + "\n");

          if(presenceData[w].data.code = 200) {
            presenceMatrix[hour][min] = true;
          }

          if(presenceData[w].data.code = 404) {
            constantPresence[hour] = false;
          }
        }

        console.log("FRIDGE DATA: " + "\n");

        for(w =0; w < fridgeData.length; ++w) {
          // Need to convert dateEvent's from Paris time to Los Angeles time!
          // this needs to be made configurable once the app moves out of PST/PDT areas!!!
          utcDateTime = new Date(fridgeData[w].dateEvent);
          momentInLA = moment.tz(utcDateTime.toISOString(), "America/Los_Angeles");
          losAngelesDateTime = new Date(momentInLA.format('YYYY-MM-DD[T]HH:mm:ss'));
          hour = losAngelesDateTime.getHours();
          min = losAngelesDateTime.getMinutes();

          console.log(hour + ":" + min + "\n");

          fridgeMatrix[hour][min] += 1;
        }

        console.log("MEDS DATA: " + "\n");

        for(w =0; w < medsData.length; ++w) {
          utcDateTime = new Date(medsData[w].dateEvent);
          momentInLA = moment.tz(utcDateTime.toISOString(), "America/Los_Angeles");
          losAngelesDateTime = new Date(momentInLA.format('YYYY-MM-DD[T]HH:mm:ss'));
          hour = losAngelesDateTime.getHours();
          min = losAngelesDateTime.getMinutes();

          console.log(hour + ":" + min + "\n");

          medsMatrix[hour][min] += 1;
        }

        //Presence of user pre-current hour: at end of hour, Displayed analysis as prescribed by
        // Claude should look at the status of the user "at the end of the hour"
        // Due to sensor timing this will need to be a bit fuzzy.
        for(w = 0; w < currentHour - 1; ++w) {

          if(presenceMatrix[w][57] || presenceMatrix[w][58] || presenceMatrix[w][59] ) {
            presenceByHour[w] = true;
          }
        }

        // Display of presence for current hour, should be the "True" presence of the user.
        // Still need to go fuzzy, as we can't rely on a sensor ping to be in the current minute.
       // Edge case of any hour between 0 to 3 min into that hour.
       if(currentMin < 3 && currentHour != 0) {
         if(presenceMatrix[currentHour - 1][57] || presenceMatrix[currentHour - 1][58] || presenceMatrix[currentHour - 1][59] ) {
           presenceByHour[currentHour] = true;
         }
       }
       // Very edge case of 12:00am to 12:03am
       if(currentMin < 3 && currentHour == 0) {
         presenceByHour[currentHour] = true;
       }

       // Normal case, do a fuzzy check for presence.
       if(presenceMatrix[currentHour][currentMin - 2] || presenceMatrix[currentHour][currentMin - 1] ||
         presenceMatrix[currentHour][currentMin] ) {
         presenceByHour[currentHour] = true;
       }


        //Analyze the fridge for hits by hour
        for(w = 0; w < currentHour; ++w) {

          for(var y = 0; y < 60; ++y) {
            fridgeHitsByHour[w] += fridgeMatrix[w][y];
          }
        }

        //Analyze the meds for hits by hour
        for(w = 0; w < currentHour; ++w) {

          for(var y = 0; y < 60; ++y) {
            medsHitsByHour[w] += medsMatrix[w][y];
          }
        }

        // Begin clearing the fridgeAlertInterval's if we have criteria to do so.
        // If they opened their fridge during an interval OR
        //     If a person isn't constantly at home during an interval we will consider
        //     that they ate somewhere else during that interval
        // Interval 1: 6:00am to 10:59am
        for(w = 5; w < 10; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval1 = false;
          }
        }

        // Interval 2: 11:00am to 3:59pm
        for(w = 10; w < 15; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval2 = false;
          }
        }

        // Interval 3: 4:00pm to 9:59pm
        for(w = 15; w < 21; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval3 = false;
          }
        }

        // Begin clearing the medsAlertInterval's if we have criteria to do so.
        // If they moved their medication during an interval OR
        //     If a person isn't constantly at home during an interval we will consider
        //     that they ate somewhere else during that interval
        // Interval 1: 6:00am to 10:59am
        for(w = 5; w < 10; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval1 = false;
          }
        }

        // Interval 2: 11:00am to 3:59pm
        for(w = 10; w < 15; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval2 = false;
          }
        }

        // Interval 3: 4:00pm to 9:59pm
        for(w = 15; w < 21; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval3 = false;
          }
        }

        // Use this hard coded date until we can pull it from each member in currentGroup
        var lastOwnershipTimeTaken = new Date("2016-01-01T01:35:29.189");
        var lastOwnershipHour = lastOwnershipTimeTaken.getHours();

        // If the last ownership time taken was on the same day,
        // we will check to see when that time was, and if after or within an
        // interval we will set the fridge alert to false.
        if(now.toDateString() == lastOwnershipTimeTaken.toDateString()) {

          if(lastOwnershipHour >= fridgeInterval1StartHour) {
            fridgeAlertInterval1 = false;
          }

          if(lastOwnershipHour >= fridgeInterval2StartHour) {
            fridgeAlertInterval2 = false;
          }

          if(lastOwnershipHour >= fridgeInterval3StartHour) {
            fridgeAlertInterval3 = false;
          }

        }

        // If the last ownership time taken was on the same day,
        // we will check to see when that time was, and if after or within an
        // interval we will set the meds alert to false.
        if(now.toDateString() == lastOwnershipTimeTaken.toDateString()) {

          if(lastOwnershipHour >= fridgeInterval1StartHour) {
            medsAlertInterval1 = false;
          }

          if(lastOwnershipHour >= fridgeInterval2StartHour) {
            medsAlertInterval2 = false;
          }

          if(lastOwnershipHour >= fridgeInterval3StartHour) {
            medsAlertInterval3 = false;
          }

        }

        // We have finished processing all exceptions to fridge interval alerts
        // when there are no fridge hits. Begin adding up fridge alert points.
        if(fridgeAlertInterval1) {
          fridgeAlertPoints += 1;
        }

        if(fridgeAlertInterval2) {
          fridgeAlertPoints += 1;
        }

        if(fridgeAlertInterval3) {
          fridgeAlertPoints += 1;
        }

        // They've only missed one meal set
        // their alert level to 1 for yellow.
        if(fridgeAlertPoints = 1) {
          fridgeAlertLevel = 1;
        }

        if(fridgeAlertPoints >= 2) {

          // Set the users fridgeAlert level to 2 for red alert.
          fridgeAlertLevel = 2;

          // **************************
          // Call local notifications here to send a red alert out for this person.
          // **************************
          // var notifViewModel = $scope.$new();   //to access Notifications functions
          // $controller('NotificationController',{$scope : notifViewModel });
          // notifViewModel.Create_Notif(0, 0, 0, false, 0);
        }

        // We have finished processing all exceptions to meds interval alerts
        // when there are no meds hits. Begin adding up meds alert points.
        if(medsAlertInterval1) {
          medsAlertPoints += 1;
        }

        if(medsAlertInterval2) {
          medsAlertPoints += 1;
        }

        if(medsAlertInterval3) {
          medsAlertPoints += 1;
        }

        // If they've missed any medications set
        // their alert level to red.
        if(medsAlertPoints > 0) {
          medsAlertLevel = 2;

          // **************************
          // Call local notifications here to send a red alert out for this person.
          // **************************
          // var notifViewModel = $scope.$new();   //to access Notifications functions
          // $controller('NotificationController',{$scope : notifViewModel });
          // notifViewModel.Create_Notif(0, 0, 0, false, 0);
        }


        // presenceMatrix a [24][60] matrix containing true in a
        // second dimension element if there was a sensor ping recorded
        // in the corresponding minute, false otherwise.

        // constantPresence a 24 element array, an element contains true
        // if the user was present at all times, specifically if an "Absent"
        // status was sent, then an element will be false.

        // presenceByHour a 24 element array, previous to the current hour an element
        // is determined by the user's presence as described in the presenceMatrix according
        // to the end of that hour and nothing else.
        // for the current hour, the user's presence is determined by their presence at the current time
        // as a fuzzy calculation of the past few minutes, as described in the presenceMatrix.

        // fridgeMatrix a [24][60] matrix containing the number of fridge motion pings during each
        // minute described by the second dimension of the matrix.

        // fridgeHitsByHour a 24 element matrix, an element is true if the fridgeMatrix had a ping anytime
        // during that corresponding hour, false otherwise.

        // fridgeInterval1Starthour a hard coded hour for the time meal interval 1 begins.
        // fridgeInterval2StarHour a hard coded hour for the time meal interval 2 begins.
        // fridgeInterval3StartHour a hard coded hour for the time meal interval 3 begins.

        // fridgeAlertInterval1 a boolean indicating true if there was no refridgerator pings
        // during meal interval 1, false otherwise.
        // fridgeAlertInterval2 a boolean indicating true if there was no refridgerator pings
        // during meal interval 2, false otherwise.
        // fridgeAlertInterval3 a boolean indicating true if there was no refridgerator pings
        // during meal interval 3, false otherwise.

        // fridgeAlertPoints the internally calculated value of fridgeAlertIntervals that were true
        // and could not be set to false due to exceptions. Currently the same as fridgeAlertLevel.

        // fridgeAlertLevel a value set by the calculation of fridgeAlertPoints, should be used as to
        // what the user's current fridge alert level should be, 0 = blue, 1 = yellow, 2 = red. Currently
        // the same as fridgeAlertPoints, may change in the future as algroithm becomes more complex.
        //
        // medsMatrix a [24][60] matrix containing the number of meds motion pings during each
        // minute described by the second dimension of the matrix.

        // medsHitsByHour a 24 element matrix, an element is true if the medsMatrix had a ping anytime
        // during that corresponding hour, false otherwise.

        // medsInterval1Starthour a hard coded hour for the time meds interval 1 begins.
        // medsInterval2StarHour a hard coded hour for the time meds interval 2 begins.
        // medsInterval3StartHour a hard coded hour for the time meds interval 3 begins.

        // medsAlertInterval1 a boolean indicating true if there was no meds pings
        // during meds interval 1, false otherwise.
        // medsAlertInterval2 a boolean indicating true if there was no meds pings
        // during meds interval 2, false otherwise.
        // medsAlertInterval3 a boolean indicating true if there was no meds pings
        // during meds interval 3, false otherwise.

        // medsAlertPoints the internally calculated value of medsAlertIntervals that were true
        // and could not be set to false due to exceptions. Currently the same as medsAlertLevel.

        // medsAlertLevel a value set by the calculation of medsAlertPoints, should be used as to
        // what the user's current meds alert level should be, 0 = blue, 1 = yellow, 2 = red. Currently
        // the same as medsAlertPoints, may change in the future as algroithm becomes more complex.


        analysisData = {

          "presenceMatrix": presenceMatrix,
          "constantPresence": constantPresence,
          "presenceByHour": presenceByHour,
          "fridgeMatrix": fridgeMatrix,
          "fridgeHitsByHour": fridgeHitsByHour,
          "fridgeInterval1StartHour": fridgeInterval1StartHour,
          "fridgeInterval2StartHour": fridgeInterval2StartHour,
          "fridgeInterval3StartHour": fridgeInterval3StartHour,
          "fridgeAlertInterval1": fridgeAlertInterval1,
          "fridgeAlertInterval2": fridgeAlertInterval2,
          "fridgeAlertInterval3": fridgeAlertInterval3,
          "fridgeAlertPoints": fridgeAlertPoints,
          "fridgeAlertLevel": fridgeAlertLevel,
          "medsMatrix": medsMatrix,
          "medsHitsByHour": medsHitsByHour,
          "medsInterval1StartHour": medsInterval1StartHour,
          "medsInterval2StartHour": medsInterval2StartHour,
          "medsInterval3StartHour": medsInterval3StartHour,
          "medsAlertInterval1": medsAlertInterval1,
          "medsAlertInterval2": medsAlertInterval2,
          "medsAlertInterval3": medsAlertInterval3,
          "medsAlertPoints": medsAlertPoints,
          "medsAlertLevel": medsAlertLevel
        }


        console.log("GROUP MEMBER ANALYSIS FOR: " + z + " " + "\n"
        + "Member name: " + $scope.groupData[z].username + "\n"
        + "presenceMatrix: " + analysisData.presenceMatrix + "\n"
        + "presenceByHour: " + analysisData.presenceByHour + "\n"
        + "fridgeMatrix: " + analysisData.fridgeMatrix + "\n"
        + "fridgeHitsByhour: " + analysisData.fridgeHitsByHour + "\n"
        + "fridgeAlertInterval1: " + analysisData.fridgeAlertInterval1 + "\n"
        + "fridgeAlertInterval2: " + analysisData.fridgeAlertInterval2 + "\n"
        + "fridgeAlertInterval3: " + analysisData.fridgeAlertInterval3 + "\n"
        + "fridgeAlertPoints: " + analysisData.fridgeAlertPoints + "\n"
        + "fridgeAlertLevel: " + analysisData.fridgeAlertLevel + "\n"
        + "medsMatrix: " + analysisData.medsMatrix + "\n"
        + "medsHitsByhour: " + analysisData.medsHitsByHour + "\n"
        + "medsAlertInterval1: " + analysisData.medsAlertInterval1 + "\n"
        + "medsAlertInterval2: " + analysisData.medsAlertInterval2 + "\n"
        + "medsAlertInterval3: " + analysisData.medsAlertInterval3 + "\n"
        + "medsAlertPoints: " + analysisData.medsAlertPoints + "\n"
        + "medsAlertLevel: " + analysisData.medsAlertLevel + "\n");

        
        console.log("analysisData.presenceByHour[5]: " + analysisData.presenceByHour[5]);

        $scope.analysis += "GROUP MEMBER: " + z + " " + "\n"
                           + "Member name: " + $scope.groupData[z].username + "\n"
                           + "presenceMatrix: " + analysisData.presenceMatrix + "\n"
                           + "presenceByHour: " + analysisData.presenceByHour + "\n"
                           + "fridgeMatrix: " + analysisData.fridgeMatrix + "\n"
                           + "fridgeHitsByhour: " + analysisData.fridgeHitsByHour + "\n"
                           + "fridgeAlertInterval1: " + analysisData.fridgeAlertInterval1 + "\n"
                           + "fridgeAlertInterval2: " + analysisData.fridgeAlertInterval2 + "\n"
                           + "fridgeAlertInterval3: " + analysisData.fridgeAlertInterval3 + "\n"
                           + "fridgeAlertPoints: " + analysisData.fridgeAlertPoints + "\n"
                           + "fridgeAlertLevel: " + analysisData.fridgeAlertLevel + "\n"
                           + "medsMatrix: " + analysisData.medsMatrix + "\n"
                           + "medsHitsByhour: " + analysisData.medsHitsByHour + "\n"
                           + "medsAlertInterval1: " + analysisData.medsAlertInterval1 + "\n"
                           + "medsAlertInterval2: " + analysisData.medsAlertInterval2 + "\n"
                           + "medsAlertInterval3: " + analysisData.medsAlertInterval3 + "\n"
                           + "medsAlertPoints: " + analysisData.medsAlertPoints + "\n"
                           + "medsAlertLevel: " + analysisData.medsAlertLevel + "\n"

        $scope.groupData[z].analysisData = analysisData;
        memberObject = $scope.groupData[z];
        //var sensorData = $scope.groupData[z].sensorData;
        // This is just a modification of what Zach has done.
        //var memberObject = {
        //  "name": memberName,
        //  "sensorData": sensorData,
        //  "analysisData": analysisData
        //};
        //DataService.addToGroup(memberObject);
        console.log("member after analysis", memberObject);
        GroupInfo.addDataToGroup(memberObject, z);
        GroupInfo.groupInfo();
        console.log("group after analysis", GroupInfo.groupInfo());
      }


      /*
       if ($scope.groupData.length < 4){
       console.log("group data array not yet ready for analysis");
       }
       */

    };
    testFunc();
    //console.log('contents of $scope.groupData in Analysis', $scope.groupData);

  };

});
