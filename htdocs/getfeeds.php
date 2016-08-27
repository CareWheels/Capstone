<?php

/*

   usernametofind - The username to search for event records.
   gt - The beginning time and date to search from in the form of YYYY-MM-DDTHH:MM:SS (ISO 8601 Date format)
   lt - the end time and date to search from in the form of YYYY-MM-DDTHH:MM:SS  (ISO 8601 Date format)



*/

include('login.php');
include('mysql_constants.php');

$usernametofind = $_POST['usernametofind'];
$beginDateTime = $_POST['gt'];
$endDateTime = $_POST['lt'];

$mysqlBeginDateTime = date("Y-m-d H:i:s",strtotime($beginDateTime));
$mysqlEndDateTime = date("Y-m-d H:i:s",strtotime($endDateTime));

http_response_code(400);

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
#echo("Connected successfully" . "\n");

mysqli_query($conn, "USE carebank");

$result = mysqli_query($conn, "SELECT feedType, dateEvent, durationSeconds FROM Users JOIN FeedInfo ON Users.gatewayNodeUid = FeedInfo.gatewayNodeUid JOIN EventData ON FeedInfo.gatewayNodeUid = EventData.gatewayNodeUid AND FeedInfo.nodeUid = EventData.nodeUid AND FeedInfo.feedId = EventData.feedId WHERE username = '". $usernametofind ."' AND dateEvent BETWEEN '". $mysqlBeginDateTime ."' AND '". $mysqlEndDateTime ."'");

date_default_timezone_set("UTC");
$events = array();

// Fetch one and one row
while ($row=mysqli_fetch_row($result)) {
    
    $row[1] = date(DATE_ISO8601, strtotime($row[1]));
    $item = array("feedType"=>$row[0], "dateEvent"=>$row[1], "durationSeconds"=>$row[2]);
    array_push($events, $item);
}
  
// Free result set
mysqli_free_result($result);
mysqli_close($conn);

http_response_code(200);
header('Content-type: application/json');
$eventsJson = json_encode($events);
echo($eventsJson);

?>
