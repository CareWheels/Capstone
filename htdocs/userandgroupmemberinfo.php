<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametofind as string: username to find the user information for.
*/

include('login.php');

http_response_code(400);
$userService = new Cyclos\UserService();
$accountService = new Cyclos\AccountService();
$phoneService = new Cyclos\PhoneService();
$groupMemberLocator = new stdclass();
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

if($groupInternalName == "") {
  http_response_code(401);
  echo("User is not in a group!");
  die();
}

try {
    $page = $userService->search($query);

    $groupMemberArray = array();

    for($x = 0; $x < count($page->pageItems); $x++) {

        $user = $userService->load($page->pageItems[$x]->id); 
        $groupMemberLocator->username = $user->username; 
        $phoneList = $phoneService->getPhoneListData($groupMemberLocator);
        $userImages = $userImageService->_list($user->id);
        $userPhoneNumber = null;

        foreach($phoneList->phones as $item) {

           if($item->nature == "MOBILE" ) {
              $userPhoneNumber = $item->normalizedNumber;
           }
        }
        
        $user->phoneNumber = $userPhoneNumber;

        if(!empty($userImages)) {
          $user->photoUrl = CYCLOSBASEURL . "/content/images/user/".$userImages[0]->key;
        }
        else {
          $user->photoUrl = null;
        }
        
        $accountSummary = $accountService->getAccountsSummary(array('username' => $user->username), NULL);
        $user->balance = $accountSummary[0]->status->balance;

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
