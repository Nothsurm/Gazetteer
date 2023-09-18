<?php 

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$time_start = microtime(true); 

$url = 'http://universities.hipolabs.com/search?country=' . urlencode($_REQUEST['country']);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$university_json = curl_exec($ch);

curl_close($ch);

function compare($x, $y) {
    if ($x["name"] == $y["name"]) return 0; 
    return ($x["name"] < $y["name"]) ? -1 : 1; 
    }

$decode = json_decode($university_json,true);

$universities = []; //Creates an empty array

for ($i = 0; $i < count($decode); $i++) {
    array_push($universities, $decode[$i]);
};

usort($universities, 'compare'); 

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = array_unique($universities, $flags=SORT_REGULAR);

echo json_encode($output);

?>