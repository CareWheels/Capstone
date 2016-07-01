<?php

/**
 * This php class handles all the views for this
 * oauth2 token retrieval and storage.
 * 
 * Created by PhpStorm.
 * User: asakawa
 * Date: 7/1/16
 * Time: 9:18 AM
 */
class Display
{
    function errorMessage($messageString)
    {
        echo <<<TAG
        <ul>
            <li id=logo></li>
            <li id="errorMessage">
               Error: $messageString
            </li>
            <li>
                
            </li>
            <li>
                <form action="javascript:history.go(-1)">
                    <input class="button smallButton left" type="submit" value="back">
                </form>      
            </li>
            <li>
                <form action="Auth.php">
                    <input class="button smallButton right" type="submit" value="restart">
                </form>      
            </li>
        </ul>    
TAG;
        die();
    }
    function welcomeMessage (){
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
            <form action="Callback.php" method="post">
                <input class="button largeButton" type="submit" value="authenticate">
            </form>      
        </li>
    </ul>
TAG;
    }
    
    function tokenMessage ($access_token, $refresh_token) {
        $username = '';
        echo <<<TAG
        <ul>
            <li id=logo></li>
            <li>
                <h4>
                    Successfully retrieved Sen.se tokens.
                </h4>
            </li>
            <li><b>access token:</b> $access_token</li><br>
            <li><b>refresh token:</b> $refresh_token</li>   
            <li>
                <h4>
                    Lets proceed with storing these tokens in
                    the care bank. Please enter the user's 
                    CareBank username.
                </h4>
            </li>
            <li>
                <form action="setTokens.php" method="post">
                    Username: <input type="text" name="username" required value=$username><br>
                    <input type="hidden" name="access_token" value=$access_token>
                    <input type="hidden" name="refresh_token" value=$refresh_token>
                    <input class="button largeButton" type="submit" value="store tokens">
                </form>      
            </li>
        </ul>
TAG;
    }
    
    
    function successMessage ($username){
        echo <<<TAG
    <ul>
        <li id=logo></li>
        <li>
            <h4>
                Success! tokens stored successfully. 
            </h4>
               <b>$username</b> now has access to the CareWheels App.
        </li>
            <li>
                <form action="http://carebank.carewheels.org/?#login">
                    <input class="button largeButton" type="submit" value="goto CareBank">
                </form>      
            </li>
    </ul>
TAG;
    }
}