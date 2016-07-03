<?php
/*
   Parameters
   username as string: the login username.
   password as string: the login password.
   usernametofind as string: the user to find all of the current day's transactions for.
*/

// Configure Cyclos and obtain an instance of LoginService
require_once 'configureCyclos.php';
$loginService = new Cyclos\LoginService();

// Set the parameters
$params = new stdclass();
$params->user = array("principal" => $_POST['username']);
$params->password = $_POST['password'];
$params->remoteAddress = $_SERVER['REMOTE_ADDR'];

// Perform the login
try {
        $result = $loginService->loginUser($params);
} catch (Cyclos\ConnectionException $e) {
        echo("Cyclos server couldn't be contacted");
        die();
} catch (Cyclos\ServiceException $e) {
        switch ($e->errorCode) {
                case 'VALIDATION':
                        echo("Missing username / password");
                        break;
                case 'LOGIN':
                        echo("Invalid username / password");
                        break;
                case 'REMOTE_ADDRESS_BLOCKED':
                        echo("Your access is blocked by exceeding invalid login attempts");
                        break;
                default:
                        echo("Error while performing login: {$e->errorCode}");
                        break;
        }
        die();
}

$transactionService = new Cyclos\TransactionService();
$query = new stdclass();
$query->owner = $_POST['usernametofind'];
$query->period = array("begin"=> date("Y-m-d")."T00:00:00.000", "end" => date("Y-m-d")."T23:59:59.999");
$query->pageSize = 9999;
$transactionList = $transactionService->search($query);

// Return the user object as json.
header('Content-type: application/json');
$json = json_encode( $transactionList );
echo($json);

?>
