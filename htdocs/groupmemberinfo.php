<?php

/*
   Parameters
   username as string: username for login.
   password as string: password for login.
   groupinternalname as string: internal name of group to find members of.   

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

$groupInternalName = array($_POST['groupinternalname']);

$userService = new Cyclos\UserService();
$query = new stdclass();
$query->groups = $groupInternalName;
$query->pageSize = 9999;

try {
    $page = $userService->search($query);

    $groupMemberArray = array();

    for($x = 0; $x < count($page->pageItems); $x++) {
    
        $user = $userService->load($page->pageItems[$x]->id);
        array_push($groupMemberArray, $user);
    }
}  catch (Cyclos\ServiceException $e) {
    echo("Error while performing group search: {$e->errorCode}");
    die();
}

// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $groupMemberArray );
echo($json);

?>
