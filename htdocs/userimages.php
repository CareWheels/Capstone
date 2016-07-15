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
    $userImageService = new Cyclos\UserImageService();
    # echo($user->id);
    $userImages = $userImageService->_list($user->id);
    $image = $userImageService->readContent($userImages[0]->id);
} catch (Cyclos\ServiceException $e) {
    echo("Error while performing user search: {$e->errorCode}");
    die();
}


#echo($image);

// Return the user object as json.
http_response_code(200);
header("Content-type: application/json");
$url = 'http://carebank.carewheels.org/content/images/user/'.$userImages[0]->key;
$raw_json = "{ 'url': '$url' }";
$json = json_encode($raw_json);
echo($json);
?>
