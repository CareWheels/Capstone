<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametoupdate as string: username that will have their lastownershiptakentime custom field updated.
    lastownershiptakentime as string: value to update lastownershiptakentime with, in the format
                                      of YYYY/MM/DD HH:MM:SS	
*/

// Configure Cyclos and obtain an instance of LoginService 

if(empty($_POST['lastownershiptakentime'])) {
    echo("lastownershiptakentime cannot be blank.");
    die();
}

include('login.php');

$userService = new Cyclos\UserService();
$locator = new stdclass();
$locator->username = $_POST['usernametoupdate'];

try {
    $user = $userService->locate($locator);
    $userInfo = $userService->load($user->id);
} catch (Cyclos\ServiceException $e) {
  echo("Error while performing user search: {$e->errorCode}");
  die();
}

try {
    for($x = 0; $x < count($userInfo->customValues); $x++) {

        // Find the accessToken field
        if($userInfo->customValues[$x]->field->internalName == 'LastOwnershipTakenTime') {
     
             // Modify the string value in the access token custom field.
             $userInfo->customValues[$x]->stringValue = $_POST['lastownershiptakentime'];

             // Save the change in the user object to the Cyclos server.
             $userService->save($userInfo);
        }
    }

    // Request the updated user information from the Cyclos server
    // so we can confirm the field was updated.
    $userInfo = $userService->load($user->id);
} catch (Cyclos\ServiceException $e) {
  echo("Error while performing user update: {$e->errorCode}");
  die();
}
// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $userInfo );
echo($json);

?>
