<?php

// Configure Cyclos and obtain an instance of LoginService
require_once 'configureCyclos.php';
$loginService = new Cyclos\LoginService();

// Set the parameters
$params = new stdclass();
$params->user = array("principal" => $_GET['username']);
$params->password = $_GET['password'];
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

$groupInternalName = array($_GET['groupinternalname']);

$userService = new Cyclos\UserService();
$query = new stdclass();
$query->groups = $groupInternalName;
$query->pageSize = 5;
$page = $userService->search($query);

$groupMemberArray = array();

for($x = 0; $x < count($page->pageItems); $x++) {

    $user = $userService->load($page->pageItems[$x]->id);
    array_push($groupMemberArray, $user);
}

// Return the user object as json.
header('Content-type: application/json');
$json = json_encode( $groupMemberArray );
echo($json);

?>

