<?php
/**
 * Created by PhpStorm.
 * User: asakawa
 * Date: 6/29/16
 * Time: 11:35 AM
 */

//require_once 'configureCyclos.php';
//$userCustomFieldService = new Cyclos\UserCustomFieldService();

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
}

// Set the parameters
$params = new stdclass();
$params->user = $_POST['username'];
$params->password = $_POST['password'];
$params->access_token = $_POST['access_token'];
$params->refresh_token = $_POST['refresh_token'];
$params->remoteAddress = $_SERVER['REMOTE_ADDR'];


/*try{ //TODO: i need an id value to query with this.
    $result = $userCustomFieldService->save($params);
} catch (Cyclos\ConnectionException $e) {
    echo "Unable to connect to CareBank";
    die();
} catch (Cyclos\ServiceException $e) {
    echo("Error while calling $e->service.$e->operation: $e->errorCode");
    die();
}*/
