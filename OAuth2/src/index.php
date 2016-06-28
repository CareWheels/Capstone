<!--
 * web page for OAuth2 client server
 *
 * Author: Chris Asakawa
 * Date: 6/22/16
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

require('Client.php');
require('GrantType/IGrantType.php');
require('GrantType/AuthorizationCode.php');

/* parameters */
const CLIENT_ID     = '';
const CLIENT_SECRET = '';
const SCOPE         = 'devices.read';
const REDIRECT_URI  = 'http://127.0.0.1:1234/src/index.php'; //url of this.php
const GRANT_TYPE    = 'authorization_code';

/* endpoints */
const AUTHORIZATION_ENDPOINT = 'https://sen.se/api/v2/oauth2/authorize';
const TOKEN_ENDPOINT         = 'https://apis.sen.se/v2/oauth2/token/';

$client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);
$username = $_POST['username'];
$password = $_POST['password'];


if (!isset($username) && !isset($password)){
    echo <<<TAG
        <ul>
            <li id=logo></li>
            <li>
                <h4>
                    Welcome to the CareWheels authentication page. Lets
                    Authenticate with Sen.se, Enter the CareBank user
                    credentials, and click the authenticate button to
                    begin.
                </h4>
            </li>
            <li>
                <form action="index.php" method="post">
                    Username: <input type="text" name="username" required value=$username><br>
                    Password:&nbsp; <input type="password" name="password" required value='$password'><br>
                    <input id="authButton" type="submit" value="authenticate">
                </form>      
            </li>
        </ul>
TAG;
}


/* if no auth code then retrieve the authentication code */
else if (!isset($_GET['code']))
{
    $auth_url = $client->getAuthenticationUrl(
                            AUTHORIZATION_ENDPOINT,
                            REDIRECT_URI,
                            array("scope" => SCOPE)
                         );
    header('Location: ' . $auth_url);
    die('Redirect');
}
else /* use the auth code to get the access and refresh tokens */
{
    $params = array('code' => $_GET['code'], 'redirect_uri' => REDIRECT_URI);
    $response = $client->getAccessToken(TOKEN_ENDPOINT, 'authorization_code', $params);

    /* testing */
    echo "access token: ";
    print_r($response["result"]["access_token"]);
    echo "<br><br>";
    echo "refresh token: ";
    print_r($response["result"]["refresh_token"]);


}
?>
</body>
</html>