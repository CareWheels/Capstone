<?php
http_response_code(400);
include("mysql_constants.php");

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";

 if(isset($_POST))
    {
       #var_dump(file_get_contents('php://input'));
       $json_input_data = json_decode(file_get_contents('php://input'),TRUE);

       $durationSeconds = null;
       $gatewayNodeUid = $json_input_data['gatewayNodeUid'];
       $nodeUid = $json_input_data['nodeUid'];
       $feedUid = $json_input_data['feedUid'];
       $dateEvent = $json_input_data['dateEvent'];
       $mysqlDateEvent = date("Y-m-d H:i:s",strtotime($dateEvent));


       if(array_key_exists('durationSeconds', $json_input_data['data'])) {
           
          $durationSeconds = $json_input_data['data']['durationSeconds'];
       }

       if($durationSeconds == null) {
          echo('$durationSeconds is null');
          $durationSeconds = NULL;
       }

       if($durationSeconds == "") {
          echo('$durationSeconds is blank');
       }

       mysqli_query($conn, "USE carebank");

       if($durationSeconds == null) {

           mysqli_query($conn, "INSERT INTO EventData (gatewayNodeUid, nodeUid, feedId, dateEvent)
                VALUES ('". $gatewayNodeUid ."', '". $nodeUid . "', '". $feedUid ."', CAST('". $mysqlDateEvent ."' AS DATETIME) )");
       }
       else {

            mysqli_query($conn, "INSERT INTO EventData (gatewayNodeUid, nodeUid, feedId, dateEvent, durationSeconds)
                VALUES ('". $gatewayNodeUid ."', '". $nodeUid . "', '". $feedUid ."', CAST('". $mysqlDateEvent ."' AS DATETIME), '". $durationSeconds ."' )");
       }

       print_r($conn);
       mysqli_close($conn);
       http_response_code(200);

       #header('Content-type: application/json');
       #echo("Type is: " . $json_input_data['type'] . "\n");
       #echo("feedUid is: " . $feedUid . "\n");
       #echo("gatewayNodeUid is: " . $gatewayNodeUid . "\n");
       #echo("nodeUid is: " . $nodeUid . "\n");
       #echo("dateEvent is: " . $dateEvent . "\n");
       #echo("fixed date time is: " . $mysqlDateEvent . "\n");
       #echo("durationSeconds is: " . $durationSeconds . "\n");

    }

?>
