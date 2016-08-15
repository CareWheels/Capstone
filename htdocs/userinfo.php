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
$accountService = new Cyclos\AccountService();
$phoneService = new Cyclos\PhoneService();
$userPhoneNumber = null;

try {
    $user = $userService->locate($locator);
    $userInfo = $userService->load($user->id);
    $userImages = $userImageService->_list($user->id);

    $accountSummary = $accountService->getAccountsSummary(array('username' => $_POST['usernametofind']),NULL);
    $phoneList = $phoneService->getPhoneListData($locator);

    foreach($phoneList->phones as $item) {
      
      if($item->nature == "MOBILE" ) {
         $userPhoneNumber = $item->normalizedNumber;
      }
    }

    $userInfo->phoneNumber = $userPhoneNumber;

    if(!empty($userImages)) {
          $userInfo->photoUrl = CYCLOSBASEURL . "/content/images/user/".$userImages[0]->key;
    }
    else {
          $userInfo->photoUrl = null;
    }
    $userInfo->balance = $accountSummary[0]->status->balance;
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
