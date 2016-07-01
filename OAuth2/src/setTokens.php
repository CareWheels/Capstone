<html>
<head>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareWheels Authentication</title>
    <link rel="stylesheet" href="style.css">

</head>
<body>
<?php
/**
 * Created by PhpStorm.
 * User: asakawa
 * Date: 6/29/16
 * Time: 11:35 AM
 */
// Configure Cyclos and obtain an instance of LoginService
require_once 'configureCyclos.php';
require 'Display.php';
$userService = new Cyclos\UserService();
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

try{
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

    
    /*
     * loads the specified user object and set the access
     * and refresh tokens to the custom fields.
     */
    $result = $userService->load($user);


    $result->customValues[0]->stringValue = $_POST['access_token']; //index 0 = access token
    $result->customValues[1]->stringValue = $_POST['refresh_token']; //index 1 = refresh token

    //Testing
    print_r($result);
    echo "<br><br>";
    print_r($result->customValues[0]);
    echo "<br><br>";
    print_r($result->customValues[1]);
    echo "<br><br>";
    print_r($result);
    echo "<br><br>";
    $display->successMessage($_POST["username"]);
    //$result = $userService->save($result);

} catch (Cyclos\ConnectionException $e) {
    $display->errorMessage("Unable to connect to CareBank");
} catch (Cyclos\ServiceException $e) {
    $display->errorMessage("Error while calling $e->service.$e->operation: $e->errorCode");
}

?>
</body>
</html>

