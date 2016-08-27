<?php

include("../mysql_constants.php");

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

$senseUsername = $_POST['senseUsername'];

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

$data['message'] = "User " . $senseUsername . " deleted from sensor feed database.";
echo(json_encode($data));
    
?>
