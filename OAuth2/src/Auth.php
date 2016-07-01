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
require('Display.php');
$display = new Display();
$display->welcomeMessage();
?>
</body>
</html>
