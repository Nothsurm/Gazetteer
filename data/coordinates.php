<?php

header('Content-Type: application/json; charset=UTF-8');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 
error_reporting(E_ALL);

$time_start = microtime(true); 

$coordinates_json = file_get_contents('countryBorders.json');

$decode = json_decode($coordinates_json,true);

$coordinates = [];

for ($i = 0; $i < count($decode['features']); $i++) {
    if($_REQUEST['iso'] == $decode['features'][$i]['properties']['iso_a2']) {
        $coordinates = $decode['features'][$i]['geometry'];
    }
};

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = [$coordinates];

echo json_encode($output)

?>