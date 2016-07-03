<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametofind as string: username to find the user information for.
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
$user = $userService->locate($locator);
$userInfo = $userService->load($user->id);

header('Content-type: application/json');
$json = json_encode( $userInfo );
echo($json);
?>
