<?php

$errors = array();
$data = array();

// Getting posted data and decodeing json
$_POST = json_decode(file_get_contents('php://input'), true);

// checking for blank values.
if (empty($_POST['senseUsername']))
  $errors['senseUsername'] = 'Sense username is required.';

if (!empty($errors)) {
  $data['errors'] = $errors;
  echo(json_encode($data));
  die();
}

date_default_timezone_set("UTC");
$senseUsername = $_POST['senseUsername'];
$motherUid = $senseUsername . "-mother";
$mealNodeUid = $senseUsername . "-fridgeNode";
$mealFeedUid = $senseUsername . "-fridgeFeed";
$mealFeedType = "meal";
$medsNodeUid = $senseUsername . "-medsNode";
$medsFeedUid = $senseUsername . "-medsFeed";
$medsFeedType = "medication";
$presenceNodeUid = $senseUsername . "-presenceNode";
$presenceFeedUid = $senseUsername . "-presenceFeed";
$presenceFeedType = "presence";

$previousDayPresence = $_POST['previousDayPresence'];
$currentDayPresence = $_POST['currentDayPresence'];
$previousDayMeal = $_POST['previousDayMeal'];
$currentDayMeal = $_POST['currentDayMeal'];
$previousDayMeds = $_POST['previousDayMeds'];
$currentDayMeds = $_POST['currentDayMeds'];


$previousDayFridgeHitsByHour = array($previousDayMeal[0], $previousDayMeal[1], $previousDayMeal[2],
                                     $previousDayMeal[3], $previousDayMeal[4], $previousDayMeal[5],
                                     $previousDayMeal[6], $previousDayMeal[7], $previousDayMeal[8],
                                     $previousDayMeal[9], $previousDayMeal[10], $previousDayMeal[11],
                                     $previousDayMeal[12], $previousDayMeal[13], $previousDayMeal[14],
                                     $previousDayMeal[15], $previousDayMeal[16], $previousDayMeal[17],
                                     $previousDayMeal[18], $previousDayMeal[19], $previousDayMeal[20],
                                     $previousDayMeal[21], $previousDayMeal[22], $previousDayMeal[23]
                              );

$currentDayFridgeHitsByHour = array($currentDayMeal[0], $currentDayMeal[1], $currentDayMeal[2],
                                    $currentDayMeal[3], $currentDayMeal[4], $currentDayMeal[5],
                                    $currentDayMeal[6], $currentDayMeal[7], $currentDayMeal[8],
                                    $currentDayMeal[9], $currentDayMeal[10], $currentDayMeal[11],
	                            $currentDayMeal[12], $currentDayMeal[13], $currentDayMeal[14],
                                    $currentDayMeal[15], $currentDayMeal[16], $currentDayMeal[17],
                                    $currentDayMeal[18], $currentDayMeal[19], $currentDayMeal[20],
                                    $currentDayMeal[21], $currentDayMeal[22], $currentDayMeal[23]
                              );

$previousDayMedsHitsByHour = array($previousDayMeds[0], $previousDayMeds[1], $previousDayMeds[2],
                                   $previousDayMeds[3], $previousDayMeds[4], $previousDayMeds[5],
                                   $previousDayMeds[6], $previousDayMeds[7], $previousDayMeds[8],
                                   $previousDayMeds[9], $previousDayMeds[10], $previousDayMeds[11],
                                   $previousDayMeds[12], $previousDayMeds[13], $previousDayMeds[14],
                                   $previousDayMeds[15], $previousDayMeds[16], $previousDayMeds[17],
                                   $previousDayMeds[18], $previousDayMeds[19], $previousDayMeds[20],
                                   $previousDayMeds[21], $previousDayMeds[22], $previousDayMeds[23]
                             );

$currentDayMedsHitsByHour = array($currentDayMeds[0], $currentDayMeds[1], $currentDayMeds[2],
                                  $currentDayMeds[3], $currentDayMeds[4], $currentDayMeds[5],
                                  $currentDayMeds[6], $currentDayMeds[7], $currentDayMeds[8],
                                  $currentDayMeds[9], $currentDayMeds[10], $currentDayMeds[11],
                                  $currentDayMeds[12], $currentDayMeds[13], $currentDayMeds[14],
                                  $currentDayMeds[15], $currentDayMeds[16], $currentDayMeds[17],
                                  $currentDayMeds[18], $currentDayMeds[19], $currentDayMeds[20],
                                  $currentDayMeds[21], $currentDayMeds[22], $currentDayMeds[23]
                            );

$previousDayPresenceByHour = array($previousDayPresence[0], $previousDayPresence[1], $previousDayPresence[2], 
                                   $previousDayPresence[3], $previousDayPresence[4], $previousDayPresence[5], 
                                   $previousDayPresence[6], $previousDayPresence[7], $previousDayPresence[8],
                                   $previousDayPresence[9], $previousDayPresence[10], $previousDayPresence[11],
                                   $previousDayPresence[12], $previousDayPresence[13], $previousDayPresence[14],
                                   $previousDayPresence[15], $previousDayPresence[16], $previousDayPresence[17],
                                   $previousDayPresence[18], $previousDayPresence[19], $previousDayPresence[20],
                                   $previousDayPresence[21], $previousDayPresence[22], $previousDayPresence[23]
                             );

$currentDayPresenceByHour = array($currentDayPresence[0], $currentDayPresence[1], $currentDayPresence[2],
                                  $currentDayPresence[3], $currentDayPresence[4], $currentDayPresence[5],
                                  $currentDayPresence[6], $currentDayPresence[7], $currentDayPresence[8],
                                  $currentDayPresence[9], $currentDayPresence[10], $currentDayPresence[11],
                                  $currentDayPresence[12], $currentDayPresence[13], $currentDayPresence[14],
                                  $currentDayPresence[15], $currentDayPresence[16], $currentDayPresence[17],
                                  $currentDayPresence[18], $currentDayPresence[19], $currentDayPresence[20],
                                  $currentDayPresence[21], $currentDayPresence[22], $currentDayPresence[23]
                            );

$previousDayPresenceData = createPresenceTestData($previousDayPresenceByHour, true);
$currentDayPresenceData = createPresenceTestData($currentDayPresenceByHour, false); 
$previousDayFridgeData = createFridgeOrMedsTestData($previousDayFridgeHitsByHour, true);
$currentDayFridgeData = createFridgeOrMedsTestData($currentDayFridgeHitsByHour, false);
$previousDayMedsData = createFridgeOrMedsTestData($previousDayMedsHitsByHour, true);
$currentDayMedsData = createFridgeOrMedsTestData($currentDayMedsHitsByHour, false);

/*
for($x = 0; $x < count($currentDayFridgeData); $x++) {
    echo("currentDayFridgeData[" . $x . "] = " . $currentDayFridgeData[$x] . "\n");
}
*/

/*
for($x = 0; $x < count($currentDayMedsData); $x++) {
    echo("currentDayMedsData[" . $x . "] = " . $currentDayMedsData[$x] . "\n");
}
*/

/*
for($x = 0; $x < count($currentDayPresenceData); $x++) {
    echo("currentDayPresenceData[" . $x . "] = " . $currentDayPresenceData[$x] . "\n");
}
*/

insertDataToUserTable($senseUsername, $motherUid);
insertDataToFeedInfoTable($motherUid, $mealNodeUid, $mealFeedUid, $mealFeedType);
insertDataToFeedInfoTable($motherUid, $medsNodeUid, $medsFeedUid, $medsFeedType);
insertDataToFeedInfoTable($motherUid, $presenceNodeUid, $presenceFeedUid, $presenceFeedType);
insertDataToEventsTable($motherUid, $mealNodeUid, $mealFeedUid, $previousDayFridgeData);
insertDataToEventsTable($motherUid, $mealNodeUid, $mealFeedUid, $currentDayFridgeData);
insertDataToEventsTable($motherUid, $medsNodeUid, $medsFeedUid, $previousDayMedsData);
insertDataToEventsTable($motherUid, $medsNodeUid, $medsFeedUid, $currentDayMedsData);
insertDataToEventsTable($motherUid, $presenceNodeUid, $presenceFeedUid, $previousDayPresenceData);
insertDataToEventsTable($motherUid, $presenceNodeUid, $presenceFeedUid, $currentDayPresenceData);

$data['message'] = "Successfully added test user " . $senseUsername . " to the sensor feed database!";
echo(json_encode($data));


function createFridgeOrMedsTestData($feedByHour, $pastDay) {
     
    $feedData = array();
    date_default_timezone_set('UTC');

    if($pastDay == true) {
        $dateTime = new DateTime('now-1day');
    }
    else {
        $dateTime = new DateTime();
    }

    $currentDay = $dateTime->format("d");
    $currentMonth = $dateTime->format("m");
    $currentYear = $dateTime->format("Y");

    for($x = 0; $x < count($feedByHour); $x++) {

        for($y = 0; $y < $feedByHour[$x]; $y++) {
                $indexDateTimeString = date("Y-m-d H:i:s", mktime($x, $y, 0, $currentMonth, 
                                      $currentDay, $currentYear));
                array_push($feedData, $indexDateTimeString);
        }
    }

    return $feedData;
}


function createPresenceTestData($feedByHour, $pastDay) {

    $feedData = array();
    date_default_timezone_set('UTC');

    if($pastDay == true) {
        $dateTime = new DateTime('now-1day');
    }
    else {
        $dateTime = new DateTime();
    }

    $currentDay = $dateTime->format("d");
    $currentMonth = $dateTime->format("m");
    $currentYear = $dateTime->format("Y");

    for($x = 0; $x < count($feedByHour); $x++) {

        if($feedByHour[$x] == true) {
           
            for($y = 0; $y < 60; $y++) {
                $indexDateTimeString = date("Y-m-d H:i:s", mktime($x, $y, 0, $currentMonth,
                                            $currentDay, $currentYear));
                array_push($feedData, $indexDateTimeString);                
            }
        }
    }

    return $feedData;
}


function insertDataToEventsTable($motherUid, $nodeUid, $feedUid, $sensorDataArray) {

    include("../mysql_constants.php");

    $durationSeconds = 2;
    $sql = "";

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
       $data['message'] = "Connection failed: " . $conn->connect_error;
       echo(json_encode($data));
       die();
    }

    mysqli_query($conn, "USE carebank");

    for($x = 0; $x < count($sensorDataArray); $x++) {

        $mysqlDateEvent = $sensorDataArray[$x]; 

        $sql .= "INSERT INTO EventData (gatewayNodeUid, nodeUid, feedId, dateEvent, durationSeconds)
                 VALUES ('". $motherUid ."', '". $nodeUid . "', '". $feedUid ."', 
                 CAST('". $mysqlDateEvent ."' AS DATETIME), '". $durationSeconds ."' );";
    }
  
    if (!mysqli_multi_query($conn, $sql)) {
       # echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
    mysqli_close($conn);
}



function insertDataToFeedInfoTable($motherUid, $nodeUid, $feedUid, $feedType) {

    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
       $data['message'] = "Connection failed: " . $conn->connect_error;
       echo(json_encode($data));
       die();
    }

    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "INSERT INTO FeedInfo (gatewayNodeUid, nodeUid, feedId, feedType)
                                  VALUES('". $motherUid ."', '". $nodeUid ."',
                                  '". $feedUid ."', '". $feedType ."')");

    mysqli_close($conn);
}


function insertDataToUserTable($senseUsername, $motherUid) {
    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
       $data['message'] = "Connection failed: " . $conn->connect_error;
       echo(json_encode($data));
       die();
    }

    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "SELECT username 
                                   FROM Users 
                                   WHERE username = '". $senseUsername ."'");

    $row_count = $result->num_rows;

    if($row_count) {
        deleteUserFromDB($senseUsername);
    }


    $result = mysqli_query($conn, "INSERT INTO Users (username, gatewayNodeUid)
                                  VALUES('". $senseUsername ."', '". $motherUid ."')");

    mysqli_close($conn);
}


function deleteUserFromDB($senseUsername) {

    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
       $data['message'] = "Connection failed: " . $conn->connect_error;
       echo(json_encode($data));
       die();
    }

    mysqli_query($conn, "USE carebank");

    mysqli_query($conn, "DELETE EventData
                         FROM EventData
                         JOIN Users
                           ON Users.gatewayNodeUid = EventData.gatewayNodeUid
                         WHERE Users.username = '". $senseUsername ."' "
    );

    mysqli_query($conn, "DELETE FeedInfo
                         FROM FeedInfo
                         JOIN Users
                           ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid
                         WHERE Users.username = '". $senseUsername ."' "
    );

    mysqli_query($conn, "DELETE
                         FROM Users
                         WHERE username = '". $senseUsername ."' "
    );

    mysqli_close($conn);
}

?>
