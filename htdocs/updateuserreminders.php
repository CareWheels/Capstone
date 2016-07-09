<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametoupdate as string: username that will have their user reminder custom fields updated.
    reminder1, reminder2, reminder3 as strings: value to update these custom fields with, in the format
                                      of HH:MM:SS	
*/

// Configure Cyclos and obtain an instance of LoginService 
require_once 'configureCyclos.php';
$loginService = new Cyclos\LoginService();

// Set the parameters
$params = new stdclass();
$params->user = array("principal" => $_POST['username']);
$params->password = $_POST['password'];
$params->remoteAddress = $_SERVER['REMOTE_ADDR'];
http_response_code(400);

// Perform the login
try {
	$result = $loginService->loginUser($params);
} catch (Cyclos\ConnectionException $e) {
	echo("Cyclos server couldn't be contacted");
	die();
} catch (Cyclos\ServiceException $e) {
	switch ($e->errorCode) {
		case 'VALIDATION':
			echo("Missing username / password");
			break;
		case 'LOGIN':
			echo("Invalid username / password");
			break;
		case 'REMOTE_ADDRESS_BLOCKED':
			echo("Your access is blocked by exceeding invalid login attempts");
			break;
		default:
			echo("Error while performing login: {$e->errorCode}");
			break;
	}
	die();
}

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
for($x = 0; $x < count($userInfo->customValues); $x++) {

    // Find the reminder1 field
    if($userInfo->customValues[$x]->field->internalName == 'reminder1') {
     
         // Modify the string value in the reminder1 custom field.
         $userInfo->customValues[$x]->stringValue = $_POST['reminder1'];
    }

    // Find the reminder2 field
    if($userInfo->customValues[$x]->field->internalName == 'reminder2') {

         // Modify the string value in the reminder2 custom field.
         $userInfo->customValues[$x]->stringValue = $_POST['reminder2'];
    }

    // Find the reminder3 field
    if($userInfo->customValues[$x]->field->internalName == 'reminder3') {

         // Modify the string value in the reminder3 custom field.
         $userInfo->customValues[$x]->stringValue = $_POST['reminder3'];
    }
}

try {    
    // Save the change in the user object to the Cyclos server.
    $userService->save($userInfo);

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
