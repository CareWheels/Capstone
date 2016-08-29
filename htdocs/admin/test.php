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
    // Fetch one and one row
    while ($row=mysqli_fetch_row($result)) {

        print_r($row);
    }




    mysqli_close($conn);

?>
