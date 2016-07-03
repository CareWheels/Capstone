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

require('Client.php');
require('GrantType/IGrantType.php');
require('GrantType/AuthorizationCode.php');

// require and obtain an instance of display
require('Display.php');
$display = new Display();

// parameters
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const SCOPE = 'devices.read';
const REDIRECT_URI = 'http://127.0.0.1:1234/src/Callback.php'; //url of this.php
const GRANT_TYPE = 'authorization_code';

// endpoints
const AUTHORIZATION_ENDPOINT = 'https://sen.se/api/v2/oauth2/authorize';
const TOKEN_ENDPOINT = 'https://apis.sen.se/v2/oauth2/token/';

$client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);

// if no authentication code then retrieve it
if (!isset($_GET['code'])) {

    $auth_url = $client->getAuthenticationUrl(
        AUTHORIZATION_ENDPOINT,
        REDIRECT_URI,
        array("scope" => SCOPE)
    );
    header('Location: ' . $auth_url);
    die('Redirect');
}
// use the auth code to get the access and refresh tokens
else {
    $params = array('code' => $_GET['code'], 'redirect_uri' => REDIRECT_URI);
    $response = $client->getAccessToken(TOKEN_ENDPOINT, 'authorization_code', $params);
    $access_token = $response["result"]["access_token"];
    $refresh_token = $response["result"]["refresh_token"];
    // success, now display the token message
    $display->tokenMessage($access_token, $refresh_token);
}
?>
</body>
</html>
