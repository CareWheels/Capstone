<?php

/*
   Parameters
   username: username for login.
   password: password for login.
   usernametocredit: username of the user to credit.
   credits as float: Number of credits to credit the user.
   alertlevel as string: Any string to record the alert level of the monitored member,
                         such as "Blue", "Yellow", or "Red".

   sensordataviewpayment a boolean as String: Records wether or not the crediting is occuring due to
                         a detailed sensor screen viewing or not. Must be "True" or "False"!

   membersummarypayment a boolean as String: Records wether or not the crediting is occuring due to
                                             a member summary screen viewing or not. Must be "True"
                                             or "False"!
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
$paymentService = new Cyclos\PaymentService();

try {
    $data = $transactionService->getPaymentData('SYSTEM', array('username' => $_POST['usernametocredit']));

    $memberSummaryPayment_field = new stdclass();
    $memberSummaryPayment_field->field = array('internalName' => 'MemberSummaryPayment');

    if($_POST['membersummarypayment'] == "True") {
      $memberSummaryPaymentValue = True;
    }
    else {
     $memberSummaryPaymentValue = False;
    }

    $memberSummaryPayment_field->booleanValue = $memberSummaryPaymentValue ;

    $sensorDataViewPayment_field = new stdclass();
    $sensorDataViewPayment_field->field = array('internalName' => 'SensorDataViewPayment');

    if($_POST['sensordataviewpayment'] == "True") {
      $sensorDataPaymentValue = True;
    }
    else {
     $sensorDataPaymentValue = False;
    }

    $sensorDataViewPayment_field->booleanValue = $sensorDataPaymentValue;

    $alertLevel_field = new stdclass();
    $alertLevel_field->field = array('internalName' => 'AlertLevel');
    $alertLevel_field->stringValue = $_POST['alertlevel'];

    $parameters = new stdclass();
    $parameters->from = $data->from;
    $parameters->to = $data->to;
    $parameters->type = $data->paymentTypes[0];
    $parameters->amount = $_POST['credits'];
    $parameters->customValues = array($memberSummaryPayment_field, $sensorDataViewPayment_field, $sensorDataViewPayment_field, $alertLevel_field);
    $parameters->description = "System payment to user";

    $paymentResult = $paymentService->perform($parameters);
    if ($paymentResult->authorizationStatus == 'PENDING_AUTHORIZATION') {
        echo("Not yet authorized\n");
    } else {
        echo("Payment done with id $paymentResult->id\n");
    }
} catch (Cyclos\ServiceException $e) {
    echo("Error while calling $e->service.$e->operation: $e->errorCode");
}

// Return the user object as json.
header('Content-type: application/json');
$json = json_encode( $paymentResult );
echo($json);

?>
