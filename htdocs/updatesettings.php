<?php

/*
    Parameters
	
	username as string: username for login.
	password as string: password for login.
	usernametoupdate as string: username that will have their lastownershiptakentime custom field updated.
    onvacation as string: value to update onVacation cutom field to, must be
                          either "True" or "False"	
*/

// Configure Cyclos and obtain an instance of LoginService 

if(empty($_POST['onvacation'])) {
    echo("onvacation cannot be blank.");
    die();
}

include('login.php');

$userService = new Cyclos\UserService();
$locator = new stdclass();
$locator->username = $_POST['usernametoupdate'];

try {
    $user = $userService->locate($locator);
    $userInfo = $userService->load($user->id);
} catch (Cyclos\ServiceException $e) {
  echo("Error while performing user search: {$e->errorCode}");
  die();
}

try {
    for($x = 0; $x < count($userInfo->customValues); $x++) {

        // Find the onvacation field
        if($userInfo->customValues[$x]->field->internalName == 'onVacation') {
     
             // Modify the string value in the onVacation custom field.
             $userInfo->customValues[$x]->booleanValue = $_POST['onvacation'];

             // Save the change in the user object to the Cyclos server.
             $userService->save($userInfo);
        }
    }

    // Request the updated user information from the Cyclos server
    // so we can confirm the field was updated.
    $userInfo = $userService->load($user->id);
} catch (Cyclos\ServiceException $e) {
  echo("Error while performing user update: {$e->errorCode}");
  die();
}

# need php-fpm and apache fastcgi setup to get mail
# done async.
# fastcgi_finish_request();

$to = ADMIN_EMAIL;
$from = CAREBANK_EMAIL;
$subject = "Vacation status changed for user " . $_POST['usernametoupdate'] . " to " . $_POST['onvacation']; 
$message = "EOM";

$headers = "From: $from"; 
$ok = @mail($to, $subject, $message, $headers, "-f " . $from);  

flush();

// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $userInfo );
echo($json);

?>
