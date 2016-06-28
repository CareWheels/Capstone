<?php
/**
 * web page for OAuth2 client server
 *
 * User: chris asakawa
 * Date: 6/22/16
 */

require('Client.php');
require('GrantType/IGrantType.php');
require('GrantType/AuthorizationCode.php');

/* parameters */
const CLIENT_ID     = '';
const CLIENT_SECRET = '';
const SCOPE         = 'devices.read';
const REDIRECT_URI  = 'http://127.0.0.1:1234/index.php'; //url of this.php
const GRANT_TYPE    = 'authorization_code';

/* endpoints */
const AUTHORIZATION_ENDPOINT = 'https://sen.se/api/v2/oauth2/authorize';
const TOKEN_ENDPOINT         = 'https://apis.sen.se/v2/oauth2/token/';

$client = new OAuth2\Client(CLIENT_ID, CLIENT_SECRET);


/* if no auth code then retrieve the authentication code */
if (!isset($_GET['code']))
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
