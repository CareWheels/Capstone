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
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php

echo <<<TAG
    <ul>
        <li id=logo></li>
        <li>
            <h4>
                Welcome to the CareWheels authentication page. Lets
                Authenticate with Sen.se, click the authenticate 
                button to begin.
            </h4>
        </li>
        <li>
            <form action="callback.php" method="post">
                <input id="authButton" type="submit" value="authenticate">
            </form>      
        </li>
    </ul>
TAG;



?>
</body>
</html>
