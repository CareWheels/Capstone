<?php

/*
   Parameters
   username as string: username for login.
   password as string: password for login.
   groupinternalname as string: internal name of group to find members of.   

*/

include('login.php');

$groupInternalName = array($_POST['groupinternalname']);

$userService = new Cyclos\UserService();
$query = new stdclass();
$query->groups = $groupInternalName;
$query->pageSize = 9999;
$userImageService = new Cyclos\UserImageService();

try {
    $page = $userService->search($query);

    $groupMemberArray = array();

    for($x = 0; $x < count($page->pageItems); $x++) {
    
        $user = $userService->load($page->pageItems[$x]->id);
        $userImages = $userImageService->_list($user->id);
        
        if(!empty($userImages)) {
          $user->photoUrl = "https://carebank.carewheels.org/content/images/user/".$userImages[0]->key;
        }
        else {
          $user->photoUrl = null;
        }

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
