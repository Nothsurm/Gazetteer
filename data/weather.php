<?php 

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$time_start = microtime(true); 

$url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['capital'] . ',' . $_REQUEST['countryCode'] . '&units=metric&appid=5b723c4450eb221cc3432183b0ab7607';

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$weather_json = curl_exec($ch);

curl_close($ch);

$decode = json_decode($weather_json,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = $decode;

echo json_encode($output);

?>