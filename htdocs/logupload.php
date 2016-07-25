<?php

/*
    Parameters

        username as string: username for login.
        password as string: password for login.
        filetoupload as file path: log file to upload
                                   ***** restricted to files end in .log only!*****
*/

include('login.php');

$target_dir = "loguploads/";
$target_file = $target_dir . basename($_FILES["filetoupload"]["name"]);
$uploadOk = 1;
$uploadFileType = pathinfo($target_file,PATHINFO_EXTENSION);

 // Check file size
if ($_FILES["filetoupload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    die();
}
// Allow certain file formats
if($uploadFileType != "log" ) {
    echo "Sorry, only log files are allowed.";
    die();
}

// if everything is ok, try to upload file
if (move_uploaded_file($_FILES["filetoupload"]["tmp_name"], $target_file)) {
    echo "The file ". basename( $_FILES["filetoupload"]["name"]). " has been uploaded.";
} 
else {
    echo "Sorry, there was an error uploading your file.";
    die();
}

// We made it to the end, send a successful response code.
http_response_code(200);

?>
