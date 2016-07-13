<?php
/*
   Parameters
   username as string: the login username.
   password as string: the login password.
   usernametofind as string: the user to find all of the current day's transactions for.
*/

if(empty($_POST['usernametofind'])) {
    echo("usernametofind cannot be blank.");
    die();
}

include('login.php');

$transactionService = new Cyclos\TransactionService();
$query = new stdclass();
$query->owner = $_POST['usernametofind'];
$query->period = array("begin"=> date("Y-m-d")."T00:00:00.000", "end" => date("Y-m-d")."T23:59:59.999");
$query->pageSize = 9999;
try {
    $transactionList = $transactionService->search($query);
} catch (Cyclos\ServiceException $e) {
    echo("Error while performing transaction search: {$e->errorCode}");
    die();
}

// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $transactionList );
echo($json);

?>
