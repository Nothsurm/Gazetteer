<?php

header('Content-Type: application/json; charset=UTF-8'); //type of returned content to the user

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); //Displays all PHP errors and warnings
error_reporting(E_ALL);

$time_start = microtime(true); //Returns a floating point value

$countryBorders_json = file_get_contents('countryBorders.json');

function compare($x, $y) {
    if ($x["name"] == $y["name"]) return 0; //user-defined function used to compare values to
    return ($x["name"] < $y["name"]) ? -1 : 1; //sort the input array
    }

$decode = json_decode($countryBorders_json,true);

$countries = []; //Creates an empty array

for ($i = 0; $i < count($decode['features']); $i++) {
    array_push($countries, $decode['features'][$i]['properties']);
};
//iterates through 'features', creates new array of 'properties':
//{"name":"Bahamas","iso_a2":"BS","iso_a3":"BHS","iso_n3":"044"}

usort($countries, 'compare'); //Sorts the countries array using the compare function above

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $time_start) * 1000) . " ms";
$output['data'] = $countries;

echo json_encode($output); //Converted to json before sending it to the ajax call

?>