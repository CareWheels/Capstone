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
$userImageService = new Cyclos\UserImageService();

try {
    $user = $userService->locate($locator);
    $userInfo = $userService->load($user->id);
    $userImages = $userImageService->_list($user->id);
    
    if(!empty($userImages)) {
          $userInfo->photoUrl = "https://carebank.carewheels.org/content/images/user/".$userImages[0]->key;
    }
    else {
          $userInfo->photoUrl = null;
    }

} catch (Cyclos\ServiceException $e) {
    echo("Error while performing user search: {$e->errorCode}");
    die();
}

// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $userInfo );
echo($json);

?>
