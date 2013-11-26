/* GPS VALUE
	coords.latitude			The latitude as a decimal number
	coords.longitude		The longitude as a decimal number
	coords.accuracy			The accuracy of position
	coords.altitude			The altitude in meters above the mean sea level
	coords.altitudeAccuracy	The altitude accuracy of position
	coords.heading			The heading as degrees clockwise from North
	coords.speed			The speed in meters per second
	timestamp				The date/time of the response

	{
	    "coords": {
	        "speed": null,
	        "accuracy": 65,
	        "altitudeAccuracy": 10,
	        "altitude": 73.99332427978516,
	        "longitude": 12.56116283256327,
	        "heading": null,
	        "latitude": 41.957746441522865
	    },
	    "timestamp": 1359975668706
	}
*/

//$('#page_training').live('pageinit', function() {
function init_training() {

    if (typeof $.cookie('user') === 'undefined')       {
        alert('è necessario effettuare il login');
        window.location.href = '/mob/login';
    }
    user = JSON.parse($.cookie('user'));

    if (typeof $.cookie('training') === 'undefined')       {
        alert('è necessario selezonare una attività sportiva');
        window.location.href = '/mob/activity';
    }
    training = JSON.parse($.cookie('training'));
    training.username = user.username;
    $.getJSON(apiurl + "activity/id/" + training.activity_id, activity_getActivityById);
   
	//Orientation
	var supportsOrientationChange = "onorientationchange" in window,
		orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

	$(window).bind( orientationEvent, onOrientationChange );

	function onOrientationChange(){
		switch( window.orientation ){
			//Portrait: normal
			case 0:
				break;
			//Landscape: clockwise
			case -90:
				break
			//Landscape: counterclockwise
			case "180":
				break;
			//Portrait: upsidedown
			case "90":
				break;
		}
	}

	//geo
	directionsDisplay = new google.maps.DirectionsRenderer();
	var myOptions = {
	    zoom: 15,
	    center: new google.maps.LatLng(41.892821731829706,12.49420166015625),
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControlOptions: {
	      mapTypeIds: [
	                   google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID,
	                   google.maps.MapTypeId.SATELLITE
	                   ]
	    },
	    disableDoubleClickZoom: true,
	    scrollwheel: false
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);

	poly.setMap(map);

	navigator.geolocation.getCurrentPosition(refreshUI, noLocation);

    /** Scatenato quando si clicca sul bottone "Inizia Allenamento" - attiva e disattiva il tracking **/
    $('#btnStart').click(function() {

        if (training_active) {
            training_active  = false;
            $("#btnStart").html('riprendi');
            
            training.end_date = new Date();
            clearInterval(timer);
        }
        else    {
            training_active = true;
            $("#btnStart").html('ferma');
            
            if (typeof training.start_date === 'undefined') {
                training.start_date = new Date();
            }
            
            if (debug) {
                $.getJSON(testJsonUrl, emulation);
            }
            else
            {
                timer = setInterval(function() {
            		navigator.geolocation.getCurrentPosition(refreshUI, noLocation);
                }, speed_timer);
            }
        }
    });

    /** Scatenato quando si clicca sul bottone "Termina Allenamento" - esce dal tracking **/
    $('#btnEnd').click(function() {
        
         if (training_active) {
            training_active  = false;
                        
            training.end_date = new Date();
            clearInterval(timer);
        }
        
        $.cookie('training', JSON.stringify(training), { expires: 1 });
        
        window.location.href = '/mob/send';
    });

}

/** Aggiunge i marker ed effettua il refresh dell'ambiente grafico UI **/
function refreshUI(event) {

    if (!(typeof event === 'undefined'))       {

        i_emulation ++;

        /** calcolo training variables - non necessitano della fase di routing **/
        if(index > 0) {
            secondi_totali = secondi_totali + speed_timer/1000;
            tempo_str = get_elapsed_time_string(secondi_totali);
            minuti_totali = Math.floor(secondi_totali / 60);

            calorie =  Math.round (minuti_totali * user.story_weight[user.story_weight.length - 1].weight * training.activity_value);
            gr_persi = Math.round (calorie/8);

            velocita_istantanea_ms = Math.round(event.coords.speed); //velocità del gps in m/s
            somma_velocita_istantanea_ms = somma_velocita_istantanea_ms + velocita_istantanea_ms;
            velocita_media_ms = Math.round( somma_velocita_istantanea_ms / index);

            velocita_istantanea_kmh = Math.round(event.coords.speed * 3.6); //moltiplico per 3.6 per sapere i Km/h
            velocita_media_kmh = Math.round(velocita_media_ms * 3.6);
        }
        /** fine calcolo training variables **/


        //Add real-time routing
    	var service = new google.maps.DirectionsService();
    	latLng = new google.maps.LatLng(event.coords.latitude, event.coords.longitude);
        
        $('input[name=segui]').is(':checked') ? map.setCenter(latLng) : null ;
        
    	if (training.events.length == 0) {

    		path.push(latLng);
    	    poly.setPath(path);
    	    markers.push(new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: false,
                icon: dotUrl
            }));
            
            /** aggiungo lat/lon a json obj **/
            var pos = [];
            pos.push(event.coords.longitude);
            pos.push(event.coords.latitude);
            training.loc.coordinates.push(pos);
            training.events.push(event);
            
            /** inizio visualizzazione valori **/
            tex_res =   'rilevazioni :' + index + ' <br>' +
                        'metri percorsi : ' + metri + '<br>' +
                        'velocità istantanea Km/h : ' + velocita_istantanea_kmh + ' <br>'+
                        'velocità istantanea m/s : ' + velocita_istantanea_ms + ' <br>'+
                        'velocità media Km/h : ' + velocita_media_kmh + ' <br>'+
                        'velocità media m/s : ' + velocita_media_ms + ' <br>'+
                        'distanza tra due punti : ' + distance_two_point + '<br>' +
                        'secondi totali : ' + secondi_totali + '<br>' +
                        'minuti totali : ' + minuti_totali + '<br>' +
                        'durata : ' + tempo_str + '<br>' +
                        'calorie : ' + calorie + '<br>' +
                        'gr persi : ' + gr_persi;

            training.total_event = index;
            training.total_meters = metri;
            training.speed_average_ms = velocita_media_ms;
            training.speed_average_kmh = velocita_media_kmh;
            training.duration_sec = secondi_totali;
            training.duration_min = minuti_totali;
            training.duration_str = tempo_str;
        	training.burned_calories = calorie;
        	training.lose_gr = gr_persi;
    
            $("#res").html(tex_res);
            $("#durata").text(tempo_str);
            $("#metri").text(metri);
            $("#velms").text(velocita_istantanea_ms);
            $("#velkmh").text(velocita_istantanea_kmh);
            $("#velmediams").text(velocita_media_ms);
            $("#velmediakmh").text(velocita_media_kmh);
            $("#cal").text(calorie);
            $("#gr").text(gr_persi);
            /** fine visualizzazione valori **/
            
    	    index++;

        } else {
        	if ((training.events[training.events.length - 1].coords.latitude != event.coords.latitude) && (training.events[training.events.length - 1].coords.longitude != event.coords.longitude)) {

                latLngPrev = new google.maps.LatLng(training.events[training.events.length - 1].coords.latitude, training.events[training.events.length - 1].coords.longitude);
                distance_two_point = Math.round(google.maps.geometry.spherical.computeDistanceBetween (latLngPrev, latLng));
                distance_two_point_loc = Math.round(getDistanceFromLatLonInKm(latLngPrev.lat(), latLngPrev.lng(), latLng.lat(), latLng.lng()) * 1000); //distanza tra due punti in m

                /** effettuo il routing stradale disegnando la spezzata dell'ultimo tratto **/
                service.route({
    		        origin: path[path.length - 1],
    		        destination: latLng,
    		        travelMode: google.maps.DirectionsTravelMode.DRIVING
    		    }, function(result, status) {
    		        if (status == google.maps.DirectionsStatus.OK) {

                        path = path.concat(result.routes[0].overview_path);
                        poly.setPath(path);
                        markers.push(new google.maps.Marker({
                          position: latLng,
                          map: map,
                          draggable: false,
                          icon: dotUrl
                        }));

                        /** aggiungo lat/lon a json obj **/
                        var pos = [];
                        pos.push(event.coords.longitude);
                        pos.push(event.coords.latitude);
                        training.loc.coordinates.push(pos);
                        training.events.push(event);
                        
                        /** calcolo training variables - necessitano della fase di routing - metri percorsi  **/
                        metri = metri + result.routes[0].legs[0].distance.value;
                        /** fine calcolo training variables **/
                        
                        /** inizio visualizzazione valori **/
                        tex_res =   'rilevazioni :' + index + ' <br>' +
                                    'metri percorsi : ' + metri + '<br>' +
                                    'velocità istantanea Km/h : ' + velocita_istantanea_kmh + ' <br>'+
                                    'velocità istantanea m/s : ' + velocita_istantanea_ms + ' <br>'+
                                    'velocità media Km/h : ' + velocita_media_kmh + ' <br>'+
                                    'velocità media m/s : ' + velocita_media_ms + ' <br>'+
                                    'distanza tra due punti google : ' + distance_two_point + '<br>' +
                                    'distanza tra due punti local : ' + distance_two_point_loc + '<br>' +
                                    'secondi totali : ' + secondi_totali + '<br>' +
                                    'minuti totali : ' + minuti_totali + '<br>' +
                                    'durata : ' + tempo_str + '<br>' +
                                    'calorie : ' + calorie + '<br>' +
                                    'gr persi : ' + gr_persi;
            
                        training.total_event = index;
                        training.total_meters = metri;
                        training.speed_average_ms = velocita_media_ms;
                        training.speed_average_kmh = velocita_media_kmh;
                        training.duration_sec = secondi_totali;
                        training.duration_min = minuti_totali;
                    	training.duration_str = tempo_str;
                    	training.burned_calories = calorie;
                    	training.lose_gr = gr_persi;
                
                        $("#res").html(tex_res);
                        $("#durata").text(tempo_str);
                        $("#metri").text(metri);
                        $("#velms").text(velocita_istantanea_ms);
                        $("#velkmh").text(velocita_istantanea_kmh);
                        $("#velmediams").text(velocita_media_ms);
                        $("#velmediakmh").text(velocita_media_kmh);
                        $("#cal").text(calorie);
                        $("#gr").text(gr_persi);
                        /** fine visualizzazione valori **/
                        
                        index++;

                    }
    		    });
        	}
        }   //end realtime routing
    }
}


function noLocation(error)	{
  switch(error.code) {
    case error.PERMISSION_DENIED:
    	alert("User denied the request for Geolocation");
      break;
    case error.POSITION_UNAVAILABLE:
    	alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
    	alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
    	alert("An unknown error occurred.");
      break;
  }
}

function emulation(event) {

    timer = setInterval(function() {
        (i_emulation < event.event.length) ? refreshUI(event.event[i_emulation]) : clearInterval(timer);
    }, speed_timer);

}

function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  var currentTimeString = hours + ":" + minutes + ":" + seconds;

  return currentTimeString;
}

function activity_getActivityById(data)    {
    training.activity_value = data.value;
    training.activity_description = data.description;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}