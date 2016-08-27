<?php

include("/opt/lappstack-7.0.7-0/apache2/htdocs/mysql_constants.php");

date_default_timezone_set("UTC");
$mysqlBeginDateTime = new DateTime();
$mysqlBeginDateTime->sub(new DateInterval('P1D'));
$mysqlBeginDateTime = $mysqlBeginDateTime->format('Y-m-d') . 'T00:00:00';

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
#echo("Connected successfully" . "\n");

mysqli_query($conn, "USE carebank");

mysqli_query($conn, "DELETE FROM EventData WHERE dateEvent < '". $mysqlBeginDateTime ."'");

mysqli_close($conn);

?>
