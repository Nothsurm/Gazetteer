<?php 

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$time_start = microtime(true); 

$url = 'https://app.goflightlabs.com/airlines?access_key=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiOTA4MjA0YzZhZTY1YzAwMTRiOWQwMmMyMzM0Yzc3NmQwMDY2NzNmNTgwNzE1M2JkYTBmYjdhZWRhNmMyOTI3M2IzZjdkMWQzM2NjYWFiMTUiLCJpYXQiOjE2ODI1Mjg3NTcsIm5iZiI6MTY4MjUyODc1NywiZXhwIjoxNzE0MTUxMTU3LCJzdWIiOiIyMDM3OSIsInNjb3BlcyI6W119.vAx6mRo7gIajnRsVyudD-mwUSpNLfxjBvLQ2X1OWSlG7_Q7XAELva4WSjjfAcoN4NKSrSYYRRCC5Iqgcnozm5g&codeIso2Country=' . $_REQUEST['iso'];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$airlines_json = curl_exec($ch);

curl_close($ch);

function compare($x, $y) {
    if ($x["nameAirline"] == $y["nameAirline"]) return 0; 
    return ($x["nameAirline"] < $y["nameAirline"]) ? -1 : 1; 
    }

$decode = json_decode($airlines_json,true);

$airlines = []; //Creates an empty array

for ($i = 0; $i < count($decode['data']); $i++) {
    array_push($airlines, $decode['data'][$i]);
};

usort($airlines, 'compare');

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = $airlines;

echo json_encode($output);

?>