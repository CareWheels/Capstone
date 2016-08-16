<?php

/*
   Parameters
   username: username for login.
   password: password for login.
   usernametocredit: username of the user to credit.
   usernametodebt: username of the user to debt, only needed for a transaction
                   between two users.
   credits as float: Number of credits to credit the user.
   alertlevel as string: Any string to record the alert level of the monitored member,
                         such as "Blue", "Yellow", or "Red".
   callpayment a boolean as String: Records whether or not the crediting is occuring due to
                         a call to a group member. Must be "True" or "False"!
   sensordataviewpayment a boolean as String: Records whether or not the crediting is occuring due to
                         a detailed sensor screen viewing or not. Must be "True" or "False"! 
   membersummarypayment a boolean as String: Records whether or not the crediting is occuring due to 
                                             a member summary screen viewing or not. Must be "True" 
                                             or "False"!
*/

include('login.php');

$transactionService = new Cyclos\TransactionService();
$paymentService = new Cyclos\PaymentService();
$query = new stdclass();
$query->owner = $_POST['usernametofind'];
$query->period = array("begin"=> date("Y-m-d")."T00:00:00.000", "end" => date("Y-m-d")."T23:59:59.999");
$query->pageSize = 9999;

$memberSummaryPaymentCheck;
$callPaymentCheck;
$sensorDataViewPaymentCheck;
$memberSummaryPaymentCount = 0;
$parsed_date;
http_response_code(400);  

try {

    if($_POST['membersummarypayment'] == "True") {
        $memberSummaryPaymentValue = True;

        $paymentList = $paymentService->search($query);

        foreach($paymentList->pageItems as $item) {

            $payment = $paymentService->getData($item->id);

            foreach($payment->transaction->customValues as $value) {

                if($value->field->internalName == MEMBER_SUMMARY_PAYMENT) {
                     $memberSummaryPaymentCheck = $value->booleanValue;
                     #echo("Member summary payment value: " . $memberSummaryPaymentCheck . " ");
                }

                if($value->field->internalName == CALL_PAYMENT) {
                    $callPaymentCheck = $value->booleanValue;
                    #echo("Call payment value: "  . $callPaymentCheck . " ");
                }

                if($value->field->internalName == SENSOR_DATA_VIEW_PAYMENT) {
                    $sensorDataViewPaymentCheck = $value->booleanValue;
                    #echo("Sensor Data View Payment value: " . $sensorDataViewPaymentCheck . " ");
                }
            }

            # We are currently not doing anything with SENSOR_DATA_VIEW PAYMENT or CALL_PAYMENT.

            if($memberSummaryPaymentCheck == "1") {
               #echo("FOUND A MEMBER SUMMARY PAYMENT! ");
               $memberSummaryPaymentCount++;

               $parsed_date = date_parse($payment->transaction->date);
               #echo("PARSED DATE HOUR: " . $parsed_date["hour"]);
               if($parsed_date["hour"] == date("H") ) {
                  #echo("FOUND A MEMBER SUMMARY PAYMENT DURING THE CURRENT HOUR!");
                  http_response_code(200);
                  die();
               }
            }

           if($memberSummaryPaymentCount >= MAX_MEMBER_SUMMARY_CREDITS_PER_DAY) {
               #echo("FOUND MAX MEMBER SUMMARY CREDITS PER DAY!");
               http_response_code(200);
               die();
           }
       }
    }
    else {
         $memberSummaryPaymentValue = False;
    }


    if($_POST['callpayment'] == "True") {
      $callPaymentValue = True;
      $usernameToDebt = array('username' => $_POST['usernametodebt']);
      $description = "User payment for call to a member.";
    }
    else {
     $callPaymentValue = False;
     $usernameToDebt = 'SYSTEM';
     $description = "System payment to user.";
    }

    $data = $transactionService->getPaymentData($usernameToDebt, array('username' => $_POST['usernametocredit']));
    
    $memberSummaryPayment_field = new stdclass();
    $memberSummaryPayment_field->field = array('internalName' => 'MemberSummaryPayment');
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

    $callPayment_field = new stdclass();
    $callPayment_field->field = array('internalName' => 'CallPayment');
    $callPayment_field->booleanValue = $callPaymentValue; 

    $alertLevel_field = new stdclass();
    $alertLevel_field->field = array('internalName' => 'AlertLevel');
    $alertLevel_field->stringValue = $_POST['alertlevel'];

    $parameters = new stdclass();
    $parameters->from = $data->from;
    $parameters->to = $data->to;
    $parameters->type = $data->paymentTypes[0];
    $parameters->amount = $_POST['credits'];
    $parameters->customValues = array($memberSummaryPayment_field, $sensorDataViewPayment_field, $sensorDataViewPayment_field, $callPayment_field, $alertLevel_field);
    $parameters->description = $description;
    
    $paymentResult = $paymentService->perform($parameters);
    if ($paymentResult->authorizationStatus == 'PENDING_AUTHORIZATION') {
        echo("Not yet authorized\n");
    }
} catch (Cyclos\ServiceException $e) {
    echo("Error while calling $e->service.$e->operation: $e->errorCode");
    die();
}

// Return the user object as json.
http_response_code(200);
header('Content-type: application/json');
$json = json_encode( $paymentResult );
echo($json);

?>
