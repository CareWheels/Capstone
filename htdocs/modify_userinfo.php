<?php

/*
   This endpoint is an example of how to modify Cyclos user custom fields.
*/


// Configure Cyclos and obtain an instance of LoginService
require_once 'configureCyclos.php';
$loginService = new Cyclos\LoginService();

// Set the parameters
$params = new stdclass();
$params->user = array("principal" => $_POST['username']);
$params->password = $_POST['password'];
$params->remoteAddress = $_SERVER['REMOTE_ADDR'];

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
$locator->username = $_POST['usernametofind'];
$locator->accesstoken = $_POST['accesstoken'];
$user = $userService->locate($locator);
$userInfo = $userService->load($user->id);

for($x = 0; $x < count($userInfo->customValues); $x++) {

    // Find the accessToken field
    if($userInfo->customValues[$x]->field->internalName == 'accessToken') {

         // Modify the string value in the access token custom field.
         $userInfo->customValues[$x]->stringValue = $_POST['accesstoken'];

         // Save the change in the user object to the Cyclos server.
         $userService->save($userInfo);
    }
}

// Request the updated user information from the Cyclos server
// so we can confirm the field was updated.
$userInfo = $userService->load($user->id);

// Return the user object as json.
header('Content-type: application/json');
$json = json_encode( $userInfo );
echo($json);

?>
