<?php
/**
 * Created by PhpStorm.
 * User: asakawa
 * Date: 6/29/16
 * Time: 10:32 PM
 */
function load($c) {
    if (strpos($c, "Cyclos\\") >= 0) {
        include str_replace("\\", "/", $c) . ".php";
    }
}
spl_autoload_register('load');
Cyclos\Configuration::setRootUrl("http://carebank.carewheels.org");
Cyclos\Configuration::setAuthentication("jerry", "pdx12345");