<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametofind as string: username to find the user information for.
*/

include('login.php');

$userService = new Cyclos\UserService();
$locator = new stdclass();
$locator->username = $_POST['usernametofind'];

try {
    $user = $userService->locate($locator);
    $userInfo = $userService->load($user->id);
} catch (Cyclos\ServiceException $e) {
    echo("Error while performing user search: {$e->errorCode}");
    die();
}

$userImageService = new Cyclos\UserImageService();
$groupInternalName = $userInfo->group->internalName;
$query = new stdclass();
$query->groups = $groupInternalName;
$query->pageSize = 9999;

try {
    $page = $userService->search($query);

    $groupMemberArray = array();

    for($x = 0; $x < count($page->pageItems); $x++) {

        $user = $userService->load($page->pageItems[$x]->id);
        $userImages = $userImageService->_list($user->id);
        $user->photoUrl = "https://carebank.carewheels.org/content/images/user/".$userImages[0]->key;
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
