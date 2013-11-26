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

function init_training() {

    User.load(function() {
       if (User.all().length == 0) {
            alert('è necessario effettuare il login');
            window.location.href = '/mob/login';
       }
       else {
            user = User.first();   
       }   
    });
    
    Training.load(function() {
       if (Training.all().length == 0) {
            alert('è necessario selezonare una attività sportiva');
            window.location.href = '/mob/activity';
       }
       else {
            training = Training.last();   
       }   
    });
    
    training.attributes.username = user.attributes.username;
    $.getJSON(apiurl + "activity/id/" + training.attributes.activity_id, activity_getActivityById);
   	
    navigator.geolocation.getCurrentPosition(refreshUI, noLocation);

    /** Scatenato quando si clicca sul bottone "Inizia Allenamento" - attiva e disattiva il tracking **/
    $('#btnStart').click(function() {

        if (training_active) {
            training_active  = false;
            $("#btnStart").html('riprendi');
            
            training.attributes.end_date = new Date();
            clearInterval(timer);
        }
        else    {
            training_active = true;
            $("#btnStart").html('ferma');
            
            if (typeof training.attributes.start_date === 'undefined') {
                training.attributes.start_date = new Date();
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
                        
            training.attributes.end_date = new Date();
            clearInterval(timer);
        }
        
        if (training.attributes.events.length > 1) {
            training.save();
            window.location.href = '/mob/send';
        }
        else {
            training.destroy();
            window.location.href = '/mob/dashboard';
        }
    });
}

/** Aggiunge i marker ed effettua il refresh dell'ambiente grafico UI **/
function refreshUI(event) {

    if (!(typeof event === 'undefined'))       {

        i_emulation ++;

        /** aggiungo lat/lon a json obj **/
        var pos = [];
        pos.push(event.coords.longitude);
        pos.push(event.coords.latitude);
        training.attributes.loc.coordinates.push(pos);
        training.attributes.events.push(event);
        
        if (training.attributes.events.length>1)    {
            
            /** calcolo training variables **/
            secondi_totali = secondi_totali + speed_timer/1000;
            tempo_str = get_elapsed_time_string(secondi_totali);
            minuti_totali = Math.floor(secondi_totali / 60);
    
            //CALORIE = ORE * PESO * MET
            /*
            calorie =  Math.round ((minuti_totali / 60) * user.attributes.story_weight[user.attributes.story_weight.length - 1].weight * training.attributes.activity_value);
            gr_persi = Math.round (calorie/8);
            */
            
            velocita_istantanea_ms = Math.round(event.coords.speed); //velocità del gps in m/s
            somma_velocita_istantanea_ms = somma_velocita_istantanea_ms + velocita_istantanea_ms;
            velocita_media_ms = Math.round( somma_velocita_istantanea_ms / training.attributes.events.length);
    
            velocita_istantanea_kmh = Math.round(event.coords.speed * 3.6); //moltiplico per 3.6 per sapere i Km/h
            velocita_media_kmh = Math.round(velocita_media_ms * 3.6);
            
            distance_two_point_km = getDistanceFromLatLonInKm(  training.attributes.events[training.attributes.events.length - 2].coords.latitude, 
                                                                training.attributes.events[training.attributes.events.length - 2].coords.longitude, 
                                                                training.attributes.events[training.attributes.events.length - 1].coords.latitude, 
                                                                training.attributes.events[training.attributes.events.length - 1].coords.longitude
                                                                ); //Km
            
            total_distance_km = total_distance_km + distance_two_point_km;
            total_distance_km = Math.round(total_distance_km * 1000) / 1000;
            total_distance_m  = total_distance_km * 1000;
            total_distance_str = total_distance_km.toString().replace('.', ',');
            
            //CALORIE = PESO * KM
            calorie =  Math.round (user.attributes.story_weight[user.attributes.story_weight.length - 1].weight * total_distance_km);
            gr_persi = Math.round((calorie / 2 ) / 9);
            
            /** verifico se le coordinate n e n-1 sono uguali - se si le tolgo dall'array **/
            if ((training.attributes.events[training.attributes.events.length - 2].coords.latitude  == event.coords.latitude) 
                && 
                (training.attributes.events[training.attributes.events.length - 2].coords.longitude == event.coords.longitude)) {
                    training.attributes.loc.coordinates.pop();
                    training.attributes.events.pop();
            }
        }
             
        
        /** visualizzazione valori **/
        training.attributes.total_event = training.attributes.events.length;
        training.attributes.total_meters = total_distance_m;
        training.attributes.speed_average_ms = velocita_media_ms;
        training.attributes.speed_average_kmh = velocita_media_kmh;
        training.attributes.duration_sec = secondi_totali;
        training.attributes.duration_min = minuti_totali;
        training.attributes.duration_str = tempo_str;
    	training.attributes.burned_calories = calorie;
    	training.attributes.lose_gr = gr_persi;

        $("#durata").text(tempo_str);
        $("#distanza_percorsa").text(total_distance_str);
        $("#velms").text(velocita_istantanea_ms);
        $("#velkmh").text(velocita_istantanea_kmh);
        $("#velmediams").text(velocita_media_ms);
        $("#velmediakmh").text(velocita_media_kmh);
        $("#cal").text(calorie);
        $("#gr").text(gr_persi);        
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
    training.attributes.activity_value = data.value;
    training.attributes.activity_description = data.description;
    
    $("#activity_description").text(training.attributes.activity_description);
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