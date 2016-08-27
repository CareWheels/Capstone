<?php

/*

   username - string of the current user's Carebank username.

   password - string of the current user's Carebank password.

   usernametofind - string of the Carebank user to get analyzed data for.

   medsinterval2 - string of 'True' or 'False' representing the Carebank 
                   medsInterval2 value for the user that is having their sensor data analyzed
                   
   medsinterval3 - string of 'True' or 'False' representing the Carebank
                   medsInterval3 value for the user that is having their sensor data analyzed

   medsinterval4 - string of 'True' or 'False' representing the Carebank
                   medsinterval4 value for the user that is having their sensor data analyzed

   onvacation - string of 'True' or 'False' representing the Carebank
                OnVacation value for the user that is having their sensor data analyzed


*/

include("login.php");

analyzeData();

function analyzeData() {
    http_response_code(400);
    date_default_timezone_set("UTC");

    if($_POST['medsinterval2'] == "" || $_POST['medsinterval3'] == "" 
       || $_POST['medsinterval4'] == "" || $_POST['onvacation'] == "") {
       echo("Missing parameter!");
       die();
    }


    if($_POST['medsinterval2'] == 'True') {
       $customMedsInterval2 = true;
    }
    else {
       $customMedsInterval2 = false;
    }

    if($_POST['medsinterval3'] == 'True') {
       $customMedsInterval3 = true;
    }
    else {
       $customMedsInterval3 = false;
    }

    if($_POST['medsinterval4'] == 'True') {
       $customMedsInterval4 = true;
    }
    else {
       $customMedsInterval4 = false;
    }

    if($_POST['onvacation'] == 'True') {
       $onVacation = true;
    }
    else {
       $onVacation = false;
    }

    $eventsArrays = getData();
    $presenceData = $eventsArrays['presenceData'];
    $fridgeData = $eventsArrays['fridgeData'];
    $medsData = $eventsArrays['medsData'];
   
    $presenceDurationCheck = false;
    $fridgeDurationCheck = false;
    $medsDurationCheck = true;
    $previousDayPresenceMatrix = array();
    $currentDayPresenceMatrix = array();
    $previousDayPresenceByHour = array();
    $currentDayPresenceByHour = array();
    $previousDayPresenceHitsByHour = array();
    $currentDayPresenceHitsByHour = array();
    $constantPresence = array();
    $previousDayFridgeMatrix = array();
    $currentDayFridgeMatrix = array();
    $currentDayFridgeHitsByHour = array();
    $previousDayFridgeHitsByHour = array();
    $currentDayMedsMatrix = array();
    $previousDayMedsMatrix = array();
    $currentDayMedsHitsByHour = array();
    $previousDayMedsHitsByHour = array();
    $tz = 'America/Los_Angeles';
    $timestamp = time();
    $dt = new DateTime("now", new DateTimeZone($tz));
    $dt->setTimestamp($timestamp);
    $currentHour = intval($dt->format('H'));
    $currentMin = intval($dt->format('i'));


    for($x = 0; $x < 24; $x++) {

        $previousDayPresenceMatirx[$x] = array();
        $currentDayPresenceMatrix[$x] = array();
        $previousDayPresenceHitsByHour[$x] = 0;
        $currentDayPresenceHitsByHour[$x] = 0;
        $previousDayFridgeMatrix[$x] = array();
        $currentDayFridgeMatrix[$x] = array();
        $currentDayFridgeHitsByHour[$x] = 0;
        $previousDayFridgeHitsByHour[$x] = 0;
        $previousDayMedsMatrix[$x] = array();
        $currentDayMedsMatrix[$x] = array();
        $previousDayMedsHitsByHour[$x] = 0;
        $currentDayMedsHitsByHour[$x] = 0;
        $constantPresence[$x] = true;
        $previousDayPresenceByHour[$x] = false;
        $currentDayPresenceByHour[$x] = false;


        for($y = 0; $y < 60; $y++) {
        
            $previousDayPresenceMatrix[$x][$y] = false;
            $currentDayPresenceMatrix[$x][$y] = false;
            $previousDayFridgeMatrix[$x][$y] = 0;
            $currentDayFridgeMatrix[$x][$y] = 0;
            $previousDayMedsMatrix[$x][$y] = 0;
            $currentDayMedsMatrix[$x][$y] = 0;
        }
    }

    if($onVacation == true) {

        $analysisData = array('medsAlertLevel'=>0,
                              'medsRollingAlertLevel'=>0,
                              'medsHitsByHour'=>$currentDayMedsHitsByHour,
                              'fridgeAlertLevel'=>0,
                              'fridgeRollingAlertLevel'=>0,
                              'fridgeHitsByHour'=>$currentDayFridgeHitsByHour,
                              'presenceByHour'=>$currentDayPresenceByHour
                        );

        http_response_code(200);
        header('Content-type: application/json');
        $json = json_encode( $analysisData );
        echo($json);
        die();
    }


    $presenceMatricies = populateDataMatrix($presenceData, $previousDayPresenceMatrix, $currentDayPresenceMatrix, 
                                            $previousDayPresenceHitsByHour, $currentDayPresenceHitsByHour, 
                                            $presenceDurationCheck);

    $previousDayPresenceMatrix = $presenceMatricies['previousDayDataMatrix'];
    $currentDayPresenceMatrix = $presenceMatricies['currentDayDataMatrix'];
    $previousDayPresenceHitsByHour = $presenceMatricies['previousDayHitsByHour'];
    $currentDayPresenceHitsByHour = $presenceMatricies['currentDayHitsByHour'];

    $fridgeMatrices = populateDataMatrix($fridgeData, $previousDayFridgeMatrix, $currentDayFridgeMatrix,
                                                 $previousDayFridgeHitsByHour, $currentDayFridgeHitsByHour,
                                                 $fridgeDurationCheck);
    $previousDayFridgeMatrix = $fridgeMatrices['previousDayDataMatrix'];
    $currentDayFridgeMatrix = $fridgeMatrices['currentDayDataMatrix'];
    $previousDayFridgeHitsByHour = $fridgeMatrices['previousDayHitsByHour'];
    $currentDayFridgeHitsByHour = $fridgeMatrices['currentDayHitsByHour'];

    $medsMatrices = populateDataMatrix($medsData, $previousDayMedsMatrix, $currentDayMedsMatrix,
                                              $previousDayMedsHitsByHour, $currentDayMedsHitsByHour,
                                              $medsDurationCheck);
    $previousDayMedsMatrix = $medsMatrices['previousDayDataMatrix'];
    $currentDayMedsMatrix = $medsMatrices['currentDayDataMatrix'];
    $previousDayMedsHitsByHour = $medsMatrices['previousDayHitsByHour'];
    $currentDayMedsHitsByHour = $medsMatrices['currentDayHitsByHour'];

    $previousDayPresenceByHour = presenceAnalysis($previousDayPresenceMatrix, $previousDayPresenceHitsByHour, 23, 59);
    $currentDayPresenceByHour = presenceAnalysis($currentDayPresenceMatrix, $currentDayPresenceHitsByHour, $currentHour, $currentMin);

    $fridgeIntervalObjectArray = getFridgeIntervals();
    $medsIntervalObjectArray = getMedsIntervals();
    $analysisObject = null;
    $previousDayCurrentHour = 24;
    $currentDayCurrentHour = $currentHour;
    // $currentDayCurrentHour = 13;   // Testing value.
    $newFridgeRollingAlertLevel = 0;
    $previousDayFridgeRollingAlertLevelArray = array();
    $currentDayFridgeRollingAlertLevelArray = array();
    $newMedsRollingAlertLevel = 0;
    $previousDayMedsRollingAlertLevelArray = array();
    $currentDayMedsRollingAlertLevelArray = array();

    $medsIntervalObjectArray['medsIntervalObject2']['pointEscalation'] = $customMedsInterval2;
    $medsIntervalObjectArray['medsIntervalObject3']['pointEscalation'] = $customMedsInterval3;
    $medsIntervalObjectArray['medsIntervalObject4']['pointEscalation'] = $customMedsInterval4;
    
    foreach($fridgeIntervalObjectArray as $fridgeIntervalObject) {

          $analysisObject = intervalAnalysis($previousDayFridgeMatrix, $fridgeIntervalObject, $previousDayPresenceByHour, 
                                   $newFridgeRollingAlertLevel, $previousDayFridgeRollingAlertLevelArray, $previousDayCurrentHour);

          $newFridgeRollingAlertLevel = $analysisObject['newRollingAlertLevel'];
          $previousDayFridgeRollingAlertLevelArray = $analysisObject['rollingAlertLevelArray'];
    }

    foreach($fridgeIntervalObjectArray as $fridgeIntervalObject) {

          $analysisObject = intervalAnalysis($currentDayFridgeMatrix, $fridgeIntervalObject, $currentDayPresenceByHour,
                                   $newFridgeRollingAlertLevel, $currentDayFridgeRollingAlertLevelArray, $currentDayCurrentHour);

          $newFridgeRollingAlertLevel = $analysisObject['newRollingAlertLevel'];
          $currentDayFridgeRollingAlertLevelArray = $analysisObject['rollingAlertLevelArray'];
    }

    foreach($medsIntervalObjectArray as $medsIntervalObject) {

          $analysisObject = intervalAnalysis($previousDayMedsMatrix, $medsIntervalObject, $previousDayPresenceByHour,
            $newMedsRollingAlertLevel, $previousDayMedsRollingAlertLevelArray, $previousDayCurrentHour);

          $newMedsRollingAlertLevel = $analysisObject['newRollingAlertLevel'];
          $previousDayMedsRollingAlertLevelArray = $analysisObject['rollingAlertLevelArray'];
    }

    foreach($medsIntervalObjectArray as $medsIntervalObject) {

          $analysisObject = intervalAnalysis($currentDayMedsMatrix, $medsIntervalObject, $currentDayPresenceByHour,
            $newMedsRollingAlertLevel, $currentDayMedsRollingAlertLevelArray, $currentDayCurrentHour);

          $newMedsRollingAlertLevel = $analysisObject['newRollingAlertLevel'];
          $currentDayMedsRollingAlertLevelArray = $analysisObject['rollingAlertLevelArray'];
    }    

   /*
   displayDebugInfo($previousDayPresenceByHour, $currentDayPresenceByHour, $previousDayPresenceHitsByHour,
                    $currentDayPresenceHitsByHour, $previousDayFridgeHitsByHour, $currentDayFridgeHitsByHour,
                    $previousDayMedsHitsByHour, $currentDayMedsHitsByHour, $previousDayMedsRollingAlertLevelArray,
                    $currentDayMedsRollingAlertLevelArray, $previousDayFridgeRollingAlertLevelArray,
                    $currentDayFridgeRollingAlertLevelArray);
   */

   $analysisData = array('medsAlertLevel'=>$newMedsRollingAlertLevel,
                         'medsRollingAlertLevel'=>$currentDayMedsRollingAlertLevelArray,
                         'medsHitsByHour'=>$currentDayMedsHitsByHour,
                         'fridgeAlertLevel'=>$newFridgeRollingAlertLevel,
                         'fridgeRollingAlertLevel'=>$currentDayFridgeRollingAlertLevelArray,
                         'fridgeHitsByHour'=>$currentDayFridgeHitsByHour,
                         'presenceByHour'=>$currentDayPresenceByHour
                   );

    http_response_code(200);
    header('Content-type: application/json');
    $json = json_encode( $analysisData );
    echo($json);
}

function getData() {

    include("mysql_constants.php");

    $usernametofind = $_POST['usernametofind'];
    $tz = new DateTimeZone("America/Los_Angeles");
    $mysqlEndDateTime = new DateTime();
    $mysqlEndDateTime->setTimezone($tz);
    $mysqlEndDateTime = $mysqlEndDateTime->format('Y-m-d') . 'T23:59:59';
    $mysqlBeginDateTime = new DateTime();
    $mysqlBeginDateTime->sub(new DateInterval('P1D'));
    $mysqlBeginDateTime->setTimezone($tz);
    $mysqlBeginDateTime = $mysqlBeginDateTime->format('Y-m-d') . 'T00:00:00';

    #$mysqlBeginDateTime = date("Y-m-d H:i:s",strtotime($beginDateTime));
    #$mysqlEndDateTime = date("Y-m-d H:i:s",strtotime($endDateTime));

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    #echo("Connected successfully" . "\n");

    date_default_timezone_set("UTC");
    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "SELECT dateEvent, durationSeconds FROM Users JOIN FeedInfo ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid JOIN EventData ON FeedInfo.gatewayNodeUid = EventData.gatewayNodeUid AND FeedInfo.nodeUid = EventData.nodeUid AND FeedInfo.feedId = EventData.feedId WHERE username = '". $usernametofind ."' AND dateEvent BETWEEN '". $mysqlBeginDateTime ."' AND '". $mysqlEndDateTime ."' AND feedType = 'presence'" );

    $presenceData = array();

    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {

        $row[0] = date(DATE_ISO8601, strtotime($row[0]));
        $item = array("dateEvent"=>$row[0], "durationSeconds"=>$row[1]);
        array_push($presenceData, $item);
    }

    $result = mysqli_query($conn, "SELECT dateEvent, durationSeconds FROM Users JOIN FeedInfo ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid JOIN EventData ON FeedInfo.gatewayNodeUid = EventData.gatewayNodeUid AND FeedInfo.nodeUid = EventData.nodeUid AND FeedInfo.feedId = EventData.feedId WHERE username = '". $usernametofind ."' AND dateEvent BETWEEN '". $mysqlBeginDateTime ."' AND '". $mysqlEndDateTime ."' AND feedType = 'meal'" );

    $fridgeData = array();

    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {

        $row[0] = date(DATE_ISO8601, strtotime($row[0]));
        $item = array("dateEvent"=>$row[0], "durationSeconds"=>$row[1]);
        array_push($fridgeData, $item);
    }

    $result = mysqli_query($conn, "SELECT dateEvent, durationSeconds FROM Users JOIN FeedInfo ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid JOIN EventData ON FeedInfo.gatewayNodeUid = EventData.gatewayNodeUid AND FeedInfo.nodeUid = EventData.nodeUid AND FeedInfo.feedId = EventData.feedId WHERE username = '". $usernametofind ."' AND dateEvent BETWEEN '". $mysqlBeginDateTime ."' AND '". $mysqlEndDateTime ."' AND feedType = 'medication'" );

    $medsData = array();

    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {

        $row[0] = date(DATE_ISO8601, strtotime($row[0]));
        $item = array("dateEvent"=>$row[0], "durationSeconds"=>$row[1]);
        array_push($medsData, $item);
    }

// Free result set
mysqli_free_result($result);
mysqli_close($conn);

    return array( "presenceData"=>$presenceData,
                  "fridgeData"=>$fridgeData,
                  "medsData"=>$medsData
                );
  
}

function populateDataMatrix($sensorDataArray, $previousDayDataMatrix, $currentDayDataMatrix,
                              $previousDayHitsByHour, $currentDayHitsByHour, $durationCheck) {


    $tz = new DateTimeZone("America/Los_Angeles");
    $currentDate = new DateTime();
    $currentDate->setTimezone($tz);
    $stringCurrentDate = $currentDate->format('Y-m-d');
    $previousDate = new DateTime();
    $previousDate->sub(new DateInterval('P1D'));
    $previousDate->setTimezone($tz);
    $stringPreviousDate = $previousDate->format('Y-m-d');

    foreach($sensorDataArray as $item) {

        $dt = new DateTime($item['dateEvent']);
        $dt->setTimezone($tz);  
        $stringDt = $dt->format('Y-m-d');  

        $hour = intval($dt->format('H'));
        $min  = intval($dt->format('i'));

        if($stringCurrentDate == $stringDt) {
            
            if(($durationCheck == true  && $item['durationSeconds'] != null 
                && $item['durationSeconds'] >= 2) || $durationCheck == false) { 
                 $currentDayDataMatrix[$hour][$min] = true;
                 $currentDayHitsByHour[$hour]++;
            }
        }

        else if($stringPreviousDate == $stringDt  ) {
                   
            if(($durationCheck == true && $item['durationSeconds'] != null
                && $item['durationSeconds'] >= 2) || $durationCheck == false) {
                 $previousDayDataMatrix[$hour][$min] = true;
                 $previousDayHitsByHour[$hour]++;
            }
        }
   }
  
#  for($x = 0; $x < count($previousDayHitsByHour); $x++) {
#      echo("Values of previousDayHitsByHour " . $x . " " . $previousDayHitsByHour[$x] . "\n");
#  }
  

  
#  for($x = 0; $x < count($currentDayDataMatrix[12]); $x++) {
#      echo("Values of currentDayDataMatrix[12] " . $x . " " . $currentDayDataMatrix[12][$x] . "\n");
#  }
  

  return array("previousDayDataMatrix"=>$previousDayDataMatrix, 
               "currentDayDataMatrix"=>$currentDayDataMatrix, 
               "previousDayHitsByHour"=>$previousDayHitsByHour, 
               "currentDayHitsByHour"=>$currentDayHitsByHour
         );

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
function presenceAnalysis($presenceMatrix, $presenceByHour, $currentHour, $currentMin) {


    // Presence of user pre-current hour: at end of hour, Displayed analysis as prescribed by
    // Claude should look at the status of the user "at the end of the hour"
    // Due to sensor timing this will need to be a bit fuzzy.
    for($x = 0; $x < $currentHour; $x++) {
        
        if ($presenceMatrix[$x][57] || $presenceMatrix[$x][58] || $presenceMatrix[$x][59]) {
        
             $presenceByHour[$x] = true;
            #echo("\n" . '$presenceByHour[' . $x . "] " . $presenceByHour[$x] . "\n");
        }
        else {
             $presenceByHour[$x] = false;
        }
    }

    // Display of presence for current hour, should be the "True" presence of the user.
    // Still need to go fuzzy, as we can't rely on a sensor ping to be in the current minute.
    // Edge case of any hour between 0 to 3 min into that hour.
    if ($currentMin < 3 && $currentHour != 0) {
        
        if ($presenceMatrix[$currentHour - 1][57] || $presenceMatrix[$currentHour - 1][58] 
              || $presenceMatrix[$currentHour - 1][59]) {
            $presenceByHour[$currentHour] = true;
            #echo("\n" . '$presenceByHour[' . $x . "] " . $presenceByHour[$x] . "\n");
        }
        else {
             $presenceByHour[$currentHour] = false;
        }
    }

    // Very edge case of 12:00am to 12:03am
    else if ($currentMin < 3 && $currentHour == 0) {
         $presenceByHour[$currentHour] = true;
         #echo("\n" . '$presenceByHour[' . $x . "] " . $presenceByHour[$x] . "\n");
    }

    // Normal case, do a fuzzy check for presence.
    else if ($currentMin >= 3 && $currentHour != 0) {

         if($presenceMatrix[$currentHour][$currentMin - 3] || $presenceMatrix[$currentHour][$currentMin - 2] 
            || $presenceMatrix[$currentHour][$currentMin - 1] || $presenceMatrix[$currentHour][$currentMin]) {
             
              $presenceByHour[$currentHour] = true;
              #echo("\n" . '$presenceByHour[' . $x . "] " . $presenceByHour[$x] . "\n");
         }
         else {
             $presenceByHour[$currentHour] = false;
         }

    }

    return $presenceByHour;

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
function intervalAnalysis($sensorDataMatrix, $intervalObject, $presenceByHourArray, $newRollingAlertLevel,
                            $rollingAlertLevelArray, $currentHour) {

    $pingDuringInterval = false;
    $x;

    // Lets check on what the suspect is doing between the hours of this interval.
    for ($x = $intervalObject['intervalStartAtHour']; $x < $intervalObject['intervalEndBeforeHour']; $x++) {

        if ($x <= $currentHour) {
            for ($y = 0; $y < count($sensorDataMatrix[$x]); $y++) {

                // HEY THEY'RE ALIVE! THAT'S GREAT!
                // OR
                // The person was gone during one of the hours. Lets assume they
                // "did stuff" while they were gone.
                if ($sensorDataMatrix[$x][$y] > 0) {
                    $pingDuringInterval = true;
                }
            }

            // If there was a ping during the interval
            // we need to completely reset the rolling
            // alert level.
            if ($pingDuringInterval) {
                $newRollingAlertLevel = 0;
            }

            // We are only going to copy over the previous alert levels
            // DURING the interval, since we can't escalate until
            // the interval has passed and they haven't caused a ping.
            $rollingAlertLevelArray[$x] = $newRollingAlertLevel;
       }
    }

    // Now that we have passed the interval we can
    // increase the alert level if needed.
    // But only escalate if: a) There was no ping during the hour,
    //                       b) The member was at home during that hour.
    //                       c) This interval has point escalation set to true.
    if (($currentHour >= $intervalObject['intervalEndBeforeHour']) && $intervalObject['pointEscalation'] &&
      !$pingDuringInterval && $presenceByHourArray[$x] == true) {

      // Well if they didn't produce a ping during the interval,
      // and they didn't leave during that interval,
      // and we are past the interval, let's increase their
      // rolling alert level.
      $newRollingAlertLevel += $intervalObject['alertPointIncrement'];
    }

    return array('newRollingAlertLevel'=>$newRollingAlertLevel,
                 'rollingAlertLevelArray'=>$rollingAlertLevelArray,
                 'pingDuringInterval'=>$pingDuringInterval
           );

}


// Placeholder for fridge interval storage,
// Should be moved to a file or database in the future.
function getFridgeIntervals() {

    $fridgeIntervalObject1 = array(
      'intervalStartAtHour'=>0,
      'intervalEndBeforeHour'=>6,
      'pointEscalation'=>false,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>1
    );

    $fridgeIntervalObject2 = array(
      'intervalStartAtHour'=>6,
      'intervalEndBeforeHour'=>11,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>1
    );

    $fridgeIntervalObject3 = array(
      'intervalStartAtHour'=>11,
      'intervalEndBeforeHour'=>16,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>1
    );

    $fridgeIntervalObject4 = array(
      'intervalStartAtHour'=>16,
      'intervalEndBeforeHour'=>22,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>1
    );

    $fridgeIntervalObject5 = array(
      'intervalStartAtHour'=>22,
      'intervalEndBeforeHour'=>24,
      'pointEscalation'=>false,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>1
    );

    $fridgeIntervalObjectArray = array(

      'fridgeIntervalObject1'=>$fridgeIntervalObject1,
      'fridgeIntervalObject2'=>$fridgeIntervalObject2,
      'fridgeIntervalObject3'=>$fridgeIntervalObject3,
      'fridgeIntervalObject4'=>$fridgeIntervalObject4,
      'fridgeIntervalObject5'=>$fridgeIntervalObject5
    );

    return $fridgeIntervalObjectArray;
  }


// Placeholder for Medication interval storage,
// Should be moved to a file or database in the future.
function getMedsIntervals() {

    $medsIntervalObject1 = array(
      'intervalStartAtHour'=>0,
      'intervalEndBeforeHour'=>6,
      'pointEscalation'=>false,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>2
    );

    $medsIntervalObject2 = array(
      'intervalStartAtHour'=>6,
      'intervalEndBeforeHour'=>11,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>2
    );

    $medsIntervalObject3 = array(
      'intervalStartAtHour'=>11,
      'intervalEndBeforeHour'=>16,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>2
    );

    $medsIntervalObject4 = array(
      'intervalStartAtHour'=>16,
      'intervalEndBeforeHour'=>22,
      'pointEscalation'=>true,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>2
    );

    $medsIntervalObject5 = array(
      'intervalStartAtHour'=>22,
      'intervalEndBeforeHour'=>24,
      'pointEscalation'=>false,
      'pingClearsAlertLevel'=>true,
      'alertPointIncrement'=>2
    );

    $medsIntervalObjectArray = array(

      'medsIntervalObject1'=>$medsIntervalObject1,
      'medsIntervalObject2'=>$medsIntervalObject2,
      'medsIntervalObject3'=>$medsIntervalObject3,
      'medsIntervalObject4'=>$medsIntervalObject4,
      'medsIntervalObject5'=>$medsIntervalObject5
    );

    return $medsIntervalObjectArray;
}

function displayDebugInfo($previousDayPresenceByHour, $currentDayPresenceByHour, $previousDayPresenceHitsByHour,
                    $currentDayPresenceHitsByHour, $previousDayFridgeHitsByHour, $currentDayFridgeHitsByHour,
                    $previousDayMedsHitsByHour, $currentDayMedsHitsByHour, $previousDayMedsRollingAlertLevelArray,
                    $currentDayMedsRollingAlertLevelArray, $previousDayFridgeRollingAlertLevelArray,
                    $currentDayFridgeRollingAlertLevelArray) {



    for($x = 0; $x < count($previousDayPresenceByHour); $x++) {
        print_r('$previousDayPresenceByHour ' . $x . " ". $previousDayPresenceByHour[$x] . "\n");
    }

    for($x = 0; $x < count($currentDayPresenceByHour); $x++) {
        print_r('$currentDayPresenceByHour ' . $x . " ". $currentDayPresenceByHour[$x] . "\n");
    }

    for($x = 0; $x < count($previousDayPresenceHitsByHour); $x++) {
        print_r('$previousDayPresenceHitsByHour ' . $x . " ". $previousDayPresenceHitsByHour[$x] . "\n");
    }

   for($x = 0; $x < count($currentDayPresenceHitsByHour); $x++) {
        print_r('$currentDayPresenceHitsByHour ' . $x . " ". $currentDayPresenceHitsByHour[$x] . "\n");
    }


    for($x = 0; $x < count($previousDayFridgeHitsByHour); $x++) {
        print_r('$previousDayFridgeHitsByHour ' . $x . " ". $previousDayFridgeHitsByHour[$x] . "\n");
    }

    for($x = 0; $x < count($currentDayFridgeHitsByHour); $x++) {
        print_r('$currentDayFridgeHitsByHour ' . $x . " ". $currentDayFridgeHitsByHour[$x] . "\n");
    }

    for($x = 0; $x < count($previousDayMedsHitsByHour); $x++) {
        print_r('$previousDayMedsHitsByHour ' . $x . " ". $previousDayMedsHitsByHour[$x] . "\n");
    }

    for($x = 0; $x < count($currentDayMedsHitsByHour); $x++) {
        print_r('$currentDayMedsHitsByHour ' . $x . " ". $currentDayMedsHitsByHour[$x] . "\n");
    }

    for($x = 0; $x < count($previousDayMedsRollingAlertLevelArray); $x++) {
        echo('$previousDayMedsRollingAlertLevelArray[' . $x . "] " .  $previousDayMedsRollingAlertLevelArray[$x] . "\n");
    }

    for($x = 0; $x < count($currentDayMedsRollingAlertLevelArray); $x++) {
        echo('$currentDayMedsRollingAlertLevelArray[' . $x . "] " .  $currentDayMedsRollingAlertLevelArray[$x] . "\n");
    }

    for($x = 0; $x < count($previousDayFridgeRollingAlertLevelArray); $x++) {
        echo('$previousDayFrideRollingAlertLevelArray[' . $x . "] " .  $previousDayFridgeRollingAlertLevelArray[$x] . "\n");
    }

    for($x = 0; $x < count($currentDayFridgeRollingAlertLevelArray); $x++) {
        echo('$currentDayFridgeRollingAlertLevelArray[' . $x . "] " .  $currentDayFridgeRollingAlertLevelArray[$x] . "\n");
    }

}



?>

