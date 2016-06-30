<!--
 * web page for OAuth2 client server
 *
 * Author: Chris Asakawa
 * Date: 6/22/16
 *
 * Authentication Flow:
 *  1. homepage, user input username and password
 *  2. redirect to sen.se auth page, returns code
 *  3. redirect to sen.se token page, returns tokens
 *  4. redirect to confirmation page
 -->

<html>
<head>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareWheels Authentication</title>
</head>
<body>
<?php

require('Client.php');
require('GrantType/IGrantType.php');
require('GrantType/AuthorizationCode.php');

/* parameters */
const CLIENT_ID     = 'EVgFXdqRIEl2oqOO8d2uh21I67KY5qDctK8Wnr9T';
const CLIENT_SECRET = 'DxvYQoHNTqYbjwkJlGO2B41a';
const SCOPE         = 'devices.read';
const REDIRECT_URI  = 'http://127.0.0.1:1234/src/Callback.php'; //url of this.php
const GRANT_TYPE    = 'authorization_code';

/* endpoints */
const AUTHORIZATION_ENDPOINT = 'https://sen.se/api/v2/oauth2/authorize';
const TOKEN_ENDPOINT         = 'https://apis.sen.se/v2/oauth2/token/';

$client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);


/* if no authentication code then retrieve it */
if (!isset($_GET['code'])) {
    
    $auth_url = $client->getAuthenticationUrl(
                            AUTHORIZATION_ENDPOINT,
                            REDIRECT_URI,
                            array("scope" => SCOPE)
                         );
    header('Location: ' . $auth_url);
    die('Redirect');
}
else {/* use the auth code to get the access and refresh tokens */

    $params = array('code' => $_GET['code'], 'redirect_uri' => REDIRECT_URI);
    $response = $client->getAccessToken(TOKEN_ENDPOINT, 'authorization_code', $params);
    $access_token = $response["result"]["access_token"];
    $refresh_token = $response["result"]["refresh_token"];

    echo <<<TAG
        <link rel="stylesheet" href="style.css">
        <ul>
            <li id=logo></li>
            <li>
                <h4>
                    Successfully retrieved Sen.se tokens.
                </h4>
            </li>
        </ul>    
TAG;

    echo "access token: ";
    print_r($access_token);
    echo "<br><br>";
    echo "refresh token: ";
    print_r($refresh_token);

    echo <<<TAG
        <ul>   
            <li>
                <h4>
                    Lets proceed with storing these tokens.
                    Please enter the CareBank user's credentials:
                </h4>
            </li>
            <li>
                <form action="CareBank.php" method="post">
                    Username: <input type="text" name="username" required value=$username><br>
                    Password:&nbsp; <input type="password" name="password" required value=$password><br>
                    <input type="hidden" name="access_token" value=$access_token>
                    <input type="hidden" name="refresh_token" value=$refresh_token>
                    <input id="authButton" type="submit" value="authenticate">
                </form>      
            </li>
        </ul>
TAG;




}
?>
</body>
</html>
