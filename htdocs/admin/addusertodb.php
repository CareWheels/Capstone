<?php

$errors = array();
$data = array();

// Getting posted data and decodeing json
$_POST = json_decode(file_get_contents('php://input'), true);

// checking for blank values.
if (empty($_POST['senseUsername']))
  $errors['senseUsername'] = 'Sense username is required.';

if (empty($_POST['sensePassword']))
  $errors['sensePassword'] = 'Sense password is required.';

if (empty($_POST['senseGatewayURL']))
  $errors['senseGatewayURL'] = 'Sense Gateway URL is required.';

if (!empty($errors)) {
  $data['errors']  = $errors;
  echo(json_encode($data));
  die();
}

$senseUserUrl = 'https://apis.sen.se/v2/user/';
$subscriptionsUrl = 'https://apis.sen.se/v2/subscriptions/';
$motherLabel = 'Carewheels';
$presenceSensorLabel = 'presenceCareBank';
$fridgeSensorLabel = 'fridgeCareBank';
$medsSensorLabel = 'medsCareBank';
$motherUid;
$presenceNodeUid;
$fridgeNodeUid;
$medsNodeUid;
$presenceFeedUid;
$fridgeFeedUid;
$medsFeedUid;
$presenceFeedType = 'presence';
$fridgeFeedType = 'meal';
$medsFeedType = 'medication';

$username = $_POST['senseUsername'];
$password = $_POST['sensePassword'];
$subscriptionGateway = $_POST['senseGatewayURL'];

$userPage = getSensePage($senseUserUrl, $username, $password);
$deviceArray = $userPage->devices;

for($x = 0; $x < count($deviceArray); $x++) {

    if($deviceArray[$x]->label == $motherLabel) {
        $motherUid = $deviceArray[$x]->uid;
    }   

}

if(!isset($motherUid)) {
    $data['message'] = "Unable to locate mother, aborting adding of user to database.";
    echo(json_encode($data));
    die();
}


$subscriptionPage = getSensePage($subscriptionsUrl, $username, $password);
$subscriptionArray = $subscriptionPage->objects;

for($x = 0; $x < count($subscriptionArray); $x++) {
    
    if($subscriptionArray[$x]->gatewayUrl == $subscriptionGateway ) {
     
       $subscribesArray = $subscriptionArray[$x]->subscribes;

       for($y = 0; $y < count($subscribesArray); $y++) {
           
           if($subscribesArray[$x]->object == 'feed') {

              $feedPage = getSensePage($subscribesArray[$y]->url, $username, $password);
              $nodePage = getSensePage($feedPage->node, $username, $password);

              if($nodePage->label == $presenceSensorLabel) {
                  $presenceNodeUid = $nodePage->uid;
                  $presenceFeedUid = $subscribesArray[$y]->uid;
                  #echo('$presenceNodeUid: ' . $presenceNodeUid ."\n");
                  #echo('$presenceFeedUid: ' . $presenceFeedUid ."\n");                 
              }

              else if($nodePage->label == $fridgeSensorLabel) {
                  $fridgeNodeUid = $nodePage->uid;
                  $fridgeFeedUid = $subscribesArray[$y]->uid;
                  #echo('$fridgeNodeUid: ' . $fridgeNodeUid ."\n");
                  #echo('$fridgeFeedUid: ' . $fridgeFeedUid ."\n");
                  
              }

              else if($nodePage->label == $medsSensorLabel) {
                  $medsNodeUid = $nodePage->uid;
                  $medsFeedUid = $subscribesArray[$y]->uid;
                  #echo('$medsNodeUid: ' . $medsNodeUid ."\n");
                  #echo('$medsFeedUid: ' . $medsFeedUid ."\n");
              }
           }
       }
    }
}

if(!isset($presenceNodeUid) || !isset($presenceFeedUid) ||
   !isset($fridgeNodeUid) || !isset($fridgeFeedUid) ||
   !isset($medsNodeUid) || !isset($medsFeedUid)) {

    $data['message'] = "Unable to get all sensor data, aborting insert into database!";
    echo(json_encode($data));
    die();
}

insertToUserTable($username, $motherUid);
insertToFeedInfoTable($motherUid, $presenceNodeUid, $presenceFeedUid, $presenceFeedType);
insertToFeedInfoTable($motherUid, $fridgeNodeUid, $fridgeFeedUid, $fridgeFeedType);
insertToFeedInfoTable($motherUid, $medsNodeUid, $medsFeedUid, $medsFeedType);

$data['message'] = "Successfully added " . $username . " to the Carebank sensor feed database.";
echo(json_encode($data));


function insertToFeedInfoTable($motherUid, $nodeUid, $feedUid, $feedType) {

    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "INSERT INTO FeedInfo (gatewayNodeUid, nodeUid, feedId, feedType)
                                  VALUES('". $motherUid ."', '". $nodeUid ."', 
                                  '". $feedUid ."', '". $feedType ."')");

    mysqli_close($conn);
}

function insertToUserTable($senseUsername, $motherUid) {
    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "INSERT INTO Users (username, gatewayNodeUid)
                                  VALUES('". $senseUsername ."', '". $motherUid ."')");

    mysqli_close($conn);
}




function getSensePage($url, $username, $password) {

    $ch = curl_init();

    curl_setopt_array(
        $ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => $username . ":" . $password
    ));

    $output = curl_exec($ch);
    $json = json_decode($output);
    curl_close($ch);

    return $json;
}



?>
