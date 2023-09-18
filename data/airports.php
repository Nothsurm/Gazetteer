<?php 

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$time_start = microtime(true); 

$url = 'https://airlabs.co/api/v9/airports?country_code=' . $_REQUEST['iso'] . '&api_key=edf56d48-6c56-495d-b2d2-39a98e721a40';

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$airport_json = curl_exec($ch);

curl_close($ch);

function compare($x, $y) {
    if ($x["name"] == $y["name"]) return 0; 
    return ($x["name"] < $y["name"]) ? -1 : 1; 
    }

$decode = json_decode($airport_json,true);

$airports = []; //Creates an empty array

for ($i = 0; $i < count($decode['response']); $i++) {
    array_push($airports, $decode['response'][$i]);
};

usort($airports, 'compare');

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = $airports;

echo json_encode($output);

?>