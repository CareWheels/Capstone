<!--
 * web page for OAuth2 client server and CareBank token storage
 *
 * Author: Chris Asakawa
 * Date: 6/22/16
 *
 * Authentication Flow:
 *  1. Auth landing page, display message, go to callback
 *  2. redirect to sen.se auth page, returns code
 *  3. redirect to sen.se token page, returns tokens
 *  4. redirect to setTokens page, get username
 *  5. save the tokens to careBank.
 -->

<html>
<head>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareWheels Authentication</title>
    <link rel="stylesheet" href="style.css">

</head>
<body>
<?php
// Configure Cyclos and obtain an instance of UserService
require_once 'configureCyclos.php';
$userService = new Cyclos\UserService();

// require and obtain an instance of display
require 'Display.php';
$display = new Display();

//error states, echo error message then redirect back to step one.
if (!isset($_POST['username']))
    $display->errorMessage("Username not set, please go back a page 
                         and re-enter the user name or restart.");
if (!isset($_POST['access_token']) || !isset($_POST['refresh_token']))
    $display->errorMessage("Unknown token, please restart the process.");


// Set the parameters for locator: used for finding the user id
$locator = new stdClass();
$locator->username = $_POST['username'];
$user = '';

try {
    // get the user id # from the
    $user = $userService->locate($locator);
    $user = get_object_vars($user);
    $user = $user["id"]; // now $user == String of digits (id#)
} catch (Cyclos\ConnectionException $e) {
    $display->errorMessage("Unable to connect to CareBank");
} catch (Cyclos\ServiceException $e) {
    $display->errorMessage("Invalid username, please go back to re-enter the username");
}

try {
    // loads the specified user object
    $result = $userService->load($user);

    // set the custom field values
    $result->customValues[0]->stringValue = $_POST['access_token']; //index 0 = access token
    $result->customValues[1]->stringValue = $_POST['refresh_token']; //index 1 = refresh token

    // save the modified user object.
    $result = $userService->save($result);

    //display the success message
    $display->successMessage($_POST["username"]);

} catch (Cyclos\ConnectionException $e) {
    $display->errorMessage("Unable to connect to CareBank");
} catch (Cyclos\ServiceException $e) {
    $display->errorMessage("Error while calling $e->service.$e->operation: $e->errorCode");
}

?>
</body>
</html>
