<?php
    include("../mysql_constants.php");

    echo("Enter Sen.se Username: ");
    $line = fgets(STDIN);
    $senseUsername = trim($line);

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
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

    echo("\nUser " . $senseUsername . " deleted from sensor feed database.\n");
?>
