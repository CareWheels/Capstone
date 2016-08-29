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

$result = mysqli_query($conn, "SELECT username, EventData.dateEvent, EventData.durationSeconds, FeedInfo.feedType
                                   FROM EventData
                                   JOIN FeedInfo
                                     ON FeedInfo.gatewayNodeUid = EventData.gatewayNodeUid
                                     AND FeedInfo.nodeUid = EventData.nodeUid
                                     AND FeedInfo.feedId = EventData.feedId
                                   JOIN Users
                                     ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid
                                   WHERE Users.username = '". $senseUsername ."'
                                   ");

    $column = mysqli_fetch_fields($result);

    $columnNames = array();
    $rows = array();

    for($x = 0; $x < count($column); $x++) {
        $columnNames[$x] = $column[$x]->name;
    }

    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {
        $tempRow = array("$columnNames[0]"=>$row[0],
                         "$columnNames[1]"=>$row[1],
                         "$columnNames[2]"=>$row[2],
                         "$columnNames[3]"=>$row[3],
                         "$columnNames[4]"=>$row[4]
                  );
        array_push($rows, $tempRow);
    }

    mysqli_close($conn);

    $result = array("columnNames"=>$columnNames, "rows"=>$rows);
    $json = json_encode($result);
    print_r($json);
    
?>
