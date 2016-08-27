<?php

    $senseUsername = 'testabc';
    include("../mysql_constants.php");

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    mysqli_query($conn, "USE carebank");

    $result = mysqli_query($conn, "SELECT *
                                   FROM Users");
    
    $column = mysqli_fetch_fields($result);

    $columnNames = array();
    $rows = array();

    for($x = 0; $x < count($column); $x++) {
        $columnNames[$x] = $column[$x]->name;     
    }
    
    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {
        $tempRow = array("$columnNames[0]"=>$row[0], 
                         "$columnNames[1]"=>$row[1]);
        
        array_push($rows, $tempRow);
    }

    mysqli_close($conn);

    $result = array("columnNames"=>$columnNames, "rows"=>$rows); 
    $json = json_encode($result);
    print_r($json);
?>
