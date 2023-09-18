/*-------------------------------------------------------------------------------------------
-------------------INITIALIZES MAP(GETS AND UPDATES CURRENT LOCATION)------------------------
-------------------------------------------------------------------------------------------*/
var map = L.map('map').fitWorld();

map.locate({ setView: true, maxZoom: 16 }); //Asks permission to show current location

if (!navigator.geolocation) {
    alert('Your current browser does not support this geolocation feature')
} else {
    navigator.geolocation.getCurrentPosition(getFunction)
};

var marker, circle;
function getFunction(position) {
/*-------------------------------------------------------------------------------------------
-----------------------------------CHANGE COUNTRY ON LOAD------------------------------------
-------------------------------------------------------------------------------------------*/

    $(document).ready(function () {
        $.ajax({
            url: 'data/countryCode.php',
            method: 'POST',
            dataType: 'json',
            data: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            success: function (result) {
                $('#country').val(result['data']['countryCode']).change()
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    })
}

/*-------------------------------------------------------------------------------------------
--------------------------------GLOBAL VARIABLES/FUNCTIONS-----------------------------------
-------------------------------------------------------------------------------------------*/

const clusterAirport = L.markerClusterGroup();

var geoJSONgroup;

const option = document.getElementById('iso');


/*-------------------------------------------------------------------------------------------
---------------------------------------EASYBUTTONS-------------------------------------------
-------------------------------------------------------------------------------------------*/

var countryInfo = L.easyButton('<img src="images/info.png" style="width:30px", "height:28px">', function () {
    $('#modalCountryInfo').modal('show');
}, 'Display Country Information');
countryInfo.addTo(map)

var currency = L.easyButton('<img src="images/currency.png" style="width:28px", "height:28px">', function () {
    $('#modalCurrency').modal('show');
}, 'Display Country Currency');
currency.addTo(map)

var weather = L.easyButton('<img src="images/weather.png" style="width:28px", "height:28px">', function () {
    $('#modalWeather').modal('show');
}, 'Display Capital Weather');
weather.addTo(map)

var university = L.easyButton('<img src="images/university.png" style="width:28px", "height:28px">', function () {
    $('#modalUniversity').modal('show');
}, 'Display Country Universities');
university.addTo(map)

var holiday = L.easyButton('<img src="images/holiday.png" style="width:28px", "height:28px">', function () {
    $('#modalHoliday').modal('show');
}, 'Display Country Holidays');
holiday.addTo(map)

var airline = L.easyButton('<img src="images/airport.png" style="width:28px", "height:28px">', function () {
    $('#modalAirlines').modal('show');
}, 'Display Country Airlines');
airline.addTo(map)

var city = L.easyButton('<img src="images/city.png" style="width:28px", "height:28px">', function () {
    $('#modalCity').modal('show');
}, 'Display Country Cities');
city.addTo(map)



/*-------------------------------------------------------------------------------------------
--------------------------------------LAYERS-------------------------------------------------
-------------------------------------------------------------------------------------------*/
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', { foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
osm.addTo(map);

var cycl = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
//cycl.addTo(map);

var darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});
//darkMap.addTo(map)

var openTopMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
//openTopMap.addTo(map)

var toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
//toner.addTo(map)

/*-------------------------------------------------------------------------------------------
---------------------------------STYLING EXTRA MARKER----------------------------------------
-------------------------------------------------------------------------------------------*/

var airplaneMarker = L.ExtraMarkers.icon({
    icon: 'fa-plane',
    markerColor: 'blue',
    shape: 'circle',
    prefix: 'fa'
});

/*-------------------------------------------------------------------------------------------
-----------------------------------LAYER CONTROLLER------------------------------------------
-------------------------------------------------------------------------------------------*/

var baseMaps = {
    "OpenStreetMap": osm,
    "CyclOSM map": cycl,
    'Dark map': darkMap,
    'Open Top map': openTopMap,
    'Toner map': toner
};

var overlayMaps = {
    "Airport Markers": clusterAirport,
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


/*-------------------------------------------------------------------------------------------
------------------------ADDING OPTIONS DYNAMICALLY TO SELECT---------------------------------
-------------------------------------------------------------------------------------------*/

$(document).ready(function () {
    $.ajax({
        url: 'data/selectedCountry.php',
        method: 'POST',
        dataType: 'json',
        success: function (result) {

            if (result.status.name == 'ok') {
                for (var i = 0; i < result['data'].length; i++) {
                    $('#country').append(
                        `<option value="${result['data'][i]['iso_a2']}">${result['data'][i]['name']}</option>`

                    )
                }

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        }

    })


/*-------------------------------------------------------------------------------------------
--------------------------------------GEOJSON DATA-------------------------------------------
-------------------------------------------------------------------------------------------*/

    $('#country').on('change', function () {
        $.ajax({
            url: 'data/coordinates.php',
            method: 'POST',
            dataType: 'json',
            data: {
                iso: $('#country').val()
            },
            success: function (result) {

                if (result.status.name == 'ok') {
                    if (geoJSONgroup) {
                        map.removeLayer(geoJSONgroup) //Removes previous country selected
                    }
                    function polystyle() {
                        return {
                            color: 'red',
                            opacity: 1,
                            fillOpacity: 0.3
                        }
                    }
                    geoJSONgroup = L.geoJSON(result['data'], { style: polystyle }).addTo(map);
                    map.fitBounds(geoJSONgroup.getBounds()); //zooms to location

            }},
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }

        })
    })

/*--------------------------------------------------------------------------------------------
------------------------------------GET API DATA----------------------------------------------
---------------------------------------------------------------------------------------------*/

$('#country').on('change', function () {
    $.ajax({
        url: 'data/geonames.php',
        method: 'POST',
        dataType: 'json',
        data: {
            countryCode: $('#country').val()
        },
        success: function (result) {

            if (result.status.name == 'ok') {

                var d = result['data'];

                $('#countryCurrency').text(d[0]['currencyCode']);
                $('#countryInfoModalLabel').html($('#country option:selected').text())

                $('#capital').html(d[0]['capital']);
                //console.log(d[0]['population'])
                $('#population').html(Math.round(d[0]['population']).toLocaleString("en-US"));
                $('#areaInSqKm').html(Math.round(d[0]['areaInSqKm']).toLocaleString("en-US"));
                

                $('.pre-load').addClass("fadeOut");
                
                $.ajax({
                    url: 'data/currencyExchange.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        currency: $('#countryCurrency').text()
                    },
                    success: function (outcome) {

                        if (result.status.name == 'ok') {
                            var o = outcome['data'];

                            $('#currencyModalLabel').html($('#country option:selected').text() + ", " + "Currency")

                            $('#currencyConversion').html(
                                `Convert 1 ${d[0]['currencyCode']} to ${o['query']['to']}`);
                            $('#result').html(o['result'], o['query']['to']);
                            $('#lastUpdated').text(o['date'].toString("HH:mm, dS MMM"));

                            $('.pre-load').addClass("fadeOut");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR)
                    }
                });

                $.ajax({
                    url: 'data/weather.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        capital: $('#capital').text(),
                        countryCode: $('#country').val()
                    },
                    success: function(solution) {

                        if (result.status.name == 'ok') {

                            var s = solution['data'];

                            $('#weatherModalLabel').html($('#country option:selected').text() + ", " + $('#capital').text())

                            $('#todayConditions').html(s['weather'][0]['description']);
                            $('#weatherIcon').attr("src", `http://openweathermap.org/img/wn/${s['weather'][0]['icon']}@2x.png`);
                            $('#todayMaxTemp').html(Math.round(s['main']['temp_max']));
                            $('#todayMinTemp').html(Math.round(s['main']['temp_min']));
                            $('#humidity').html(s['main']['humidity'] + "%");
                            $('#windSpeed').html(Math.round(s['wind']['speed']) + " " + "MPH")
                            $('#lastUpdatedWeather').html(new Date().toString("HH:mm"))

                            $('.pre-load').addClass("fadeOut");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR)
                    }
                });

                $.ajax({
                    url: 'data/forecast.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        capital: $('#capital').text(),
                        countryCode: $('#country').val()
                    },
                    success: function(answer) {

                        if (result.status.name == 'ok') {

                            var a = answer['data']

                            $('#tomorrowDate').html(Date.parse(a['list']['5']['dt_txt']).toString("ddd dS"));
                            $('#tomorrowMaxTemp').html(Math.round(a['list']['5']['main']['temp_max']));
                            $('#tomorrowMinTemp').html(Math.round(a['list']['5']['main']['temp_min']));
                            $('#tomorrowWeatherIcon').attr("src", `http://openweathermap.org/img/wn/${a['list']['5']['weather'][0]['icon']}@2x.png`);

                            $('#day2Date').html(Date.parse(a['list']['13']['dt_txt']).toString("ddd dS"));
                            $('#day2MaxTemp').html(Math.round(a['list']['13']['main']['temp_max']));
                            $('#day2MinTemp').html(Math.round(a['list']['13']['main']['temp_min']));
                            $('#day2WeatherIcon').attr("src", `http://openweathermap.org/img/wn/${a['list']['13']['weather'][0]['icon']}@2x.png`);
                            
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR)
                    }
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        }
    })
})

    $('#country').on('change', function () {
        $.ajax({
            url: 'data/universities.php',
            method: 'POST',
            dataType: 'json',
            data: {
                country: $('#country option:selected').text()
            },
            success: function (result) {

                if (result.status.name == 'ok') {

                    $('#universityModalLabel').html($('#country option:selected').text() + ", " + "Universities");

                    $('#modal-university').html(
                    `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Website</th>
                            </tr>
                        </thead>
                        <tbody id="university">
                        </tbody>
                    </table>`
                    )

                    $.each(result['data'], function(key, value) {
                        //console.log(key)
                        //console.log(value)
                        $('#university').append(
                            `<tr>
                               <td>${value.name}</td>
                               <td><a href="${value.web_pages}">${value.web_pages}</a></td>
                            </tr>`
                        );
                    })

                    $('.pre-load').addClass("fadeOut");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    })

    $('#country').on('change', function () {
        $.ajax({
            url: 'data/holiday.php',
            method: 'POST',
            dataType: 'json',
            data: {
                iso: $('#country').val()
            },
            success: function (result) {
                if (result.status.name == 'ok') {

                    var d = result['data']['holidays'];

                    $('#holidayModalLabel').html($('#country option:selected').text() + ", " + "Holidays")

                    $('#modal-holiday').html(
                    `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody id="holiday">
                        </tbody>
                    </table>`
                    )

                    for (var i = 0; i < d.length; i++) {
                        $('#holiday').append(
                            `<tr>
                                <td>${d[i]['name']}</td>
                                <td>${Date.parse(d[i]['date']).toString("ddd dS MMM")}</td>
                            </tr>`
                        )
                    }

                    $('.pre-load').addClass("fadeOut");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    });

    $('#country').on('change', function() {
        $.ajax({
            url: 'data/airlines.php',
            method: 'POST',
            dataType: 'json',
            data: {
                iso: $('#country').val()
            },
            success: function (result) {

                if (result.status.name == 'ok') {

                    $('#airlinesModalLabel').html($('#country option:selected').text() + ", " + "Airlines")

                    $('#modal-airline').html(
                    `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Icao_Code</th>
                                <th scope="col">Type</th>
                            </tr>
                        </thead>
                        <tbody id="airline-data">
                        </tbody>
                    </table>`
                    )

                    for (var i = 0; i < result['data'].length; i++) {
                        $('#airline-data').append(
                            `<tr>
                                <td>${result['data'][i]['nameAirline']}</td>
                                <td>${result['data'][i]['codeIcaoAirline']}</td>
                                <td>${result['data'][i]['type']}</td>
                            </tr>`
                        )
                    }

                    $('.pre-load').addClass("fadeOut");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    });

/*-------------------------------------------------------------------------------------------
--------------------------------------MARKER CLUSTERS----------------------------------------
-------------------------------------------------------------------------------------------*/

    $('#country').on('change', function () {
        $.ajax({
            url: 'data/cities.php',
            method: 'POST',
            dataType: 'json',
            data: {
                iso: $('#country').val()
            },
            success: function (result) {
                if (result.status.name == 'ok') {

                    $('#cityModalLabel').html($('#country option:selected').text() + ", " + "Cities")

                    $('#modal-city').html(
                    `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">City Code</th>
                            </tr>
                        </thead>
                        <tbody id="city-data">
                        </tbody>
                    </table>`
                    )

                    for (var i = 0; i < result['data'].length; i++) {
                        $('#city-data').append(
                            `<tr>
                                <td>${result['data'][i]['nameCity']}</td>
                                <td>${result['data'][i]['codeIataCity']}</td>
                            </tr>`
                        )
                    };

                    $('.pre-load').addClass("fadeOut");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }

        })
    })

    $('#country').on('change', function () {
        $.ajax({
            url: 'data/airports.php',
            method: 'POST',
            dataType: 'json',
            data: {
                iso: $('#country').val()
            },
            success: function (result) {

                if (result.status.name == 'ok') {
                    if (clusterAirport) {
                        clusterAirport.clearLayers()
                    } 

                    for (i = 0; i < result['data'].length; i++) {
                        if (result['data'][i]['lat'] !== 0 || result['data'][i]['lng'] !== 0) {
                        var marker = L.marker(
                            L.latLng(
                                result['data'][i]['lat'], result['data'][i]['lng']), 
                                    {
                                        title: `${result['data'][i]['name']}`,
                                        icon: airplaneMarker
                                    }
                        );
                        clusterAirport.addLayer(marker);
                        map.addLayer(clusterAirport);
                        marker.bindPopup(`Airport: ${result['data'][i]['name']}`);
                    }
                }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    })
})

$('.pre-load').addClass("fadeOut");