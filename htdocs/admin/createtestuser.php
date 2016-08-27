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

$previousDayFridgeHitsByHour = array( 1, 1, 1, 1, 1, 1, 1, 1,
                                     1, 1, 1, 1, 1, 1, 1, 1,
                                     1, 1, 1, 1, 1, 1, 1, 1
                              );

$currentDayFridgeHitsByHour = array( 1, 1, 1, 1, 1, 1, 1, 1,
                                     1, 1, 1, 1, 1, 1, 1, 1,
                                     1, 1, 1, 1, 1, 1, 1, 1
                              );



$previousDayMedsHitsByHour = array( 1, 1, 1, 1, 1, 1, 1, 1,
                                    1, 1, 1, 1, 1, 1, 1, 1,
                                    1, 1, 1, 1, 1, 1, 1, 1
                             );

$currentDayMedsHitsByHour = array( 1, 1, 1, 1, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 1, 1, 1
                             );


$previousDayPresenceByHour = array( true, true, true, true, true, true, true, true,
                                    true, true, true, true, true, true, true, true,
                                    true, true, true, true, true, true, true, true
                             );

$currentDayPresenceByHour = array( true, true, true, true, true, true, true, true,
                                   true, true, true, true, true, true, true, true,
                                   true, true, true, true, true, true, true, true
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
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
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
