<?php
/**
 * Created by PhpStorm.
 * User: asakawa
 * Date: 6/29/16
 * Time: 11:35 AM
 */
// Configure Cyclos and obtain an instance of LoginService
require_once 'configureCyclos.php';
$userService = new Cyclos\UserService();


//error state, echo error message then redirect back to step one.
if (empty($_POST)) {
    echo <<<TAG
        <link rel="stylesheet" href="style.css">
        <ul>
            <li id=logo></li>
            <li>
                <h4 style="background-color:red; color:white;">
                    Error: failed to retrieve Sen.se tokens. Click the button
                    below to restart the authentication process.
                </h4>
            </li>
            <li>
                <form action="Auth.php" method="post">
                    <input id="authButton" type="submit" value="restart">
                </form>      
            </li>
        </ul>    
TAG;
    die();
}

// Set the parameters for locator: used for finding the user id
$locator = new stdClass();
$locator->username = $_POST['username'];

try {
    // get the user id # from the 
    $user = $userService->locate($locator);
    print_r($user);
    $user = get_object_vars($user);
    $user = $user["id"]; // now $user == String of digits (id#)
    
    /*
     * loads the specified user object and set the access
     * and refresh tokens to the custom fields.
     */
    $result = $userService->load($user);

    //TODO: need to add some error checking to make sure this index values are correct

    $result->customValues[0]->stringValue = $_POST['access_token']; //index 0 = access token
    $result->customValues[1]->stringValue = $_POST['refresh_token']; //index 1 = refresh token

    //Testing
/*    print_r($result);
    echo "<br><br>";
    print_r($result->customValues[0]);
    echo "<br><br>";
    print_r($result->customValues[1]);
    echo "<br><br>";
    print_r($result);
    echo "<br><br>";*/

    $result = $userService->save($result);
    print_r($result);


} catch (Cyclos\ConnectionException $e) {
    echo "Unable to connect to CareBank";
    die();
} catch (Cyclos\ServiceException $e) {
    echo("Error while calling $e->service.$e->operation: $e->errorCode");
    die();
}

