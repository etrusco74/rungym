/** API URL **/
var debug = true;

/** development, production **/
var env = 'development'; 
//var env = 'production';

var domain = '';
(env == 'development') ? domain = 'http://rungym.etrusco.c9.io' : domain = 'http://www.rungym.com';

var apiurl = domain + '/api/';
var testJsonUrl = domain + '/mob/events.json';


/** GLOBAL VARIABLE - COOKIE **/
var user = {};
var training = {
          "events": [],
          "loc": {
              "type" : "LineString",
              "coordinates" : []
          }
        };
        

/** REALTIME ROUTING **/
var map;
var latLng;
var latLngPrev;
var path = [];
var polyOptions = {
		strokeColor: '#cc3300',
		strokeOpacity: 0.5,
		strokeWeight: 3
}
var poly = new google.maps.Polyline(polyOptions);
var markers = [];
var dotUrl = 'it/img/maps/bullet_green.png';

/** TRAINING VARIABLES **/
var event;
var timer;
var training_active = false;

var tex_res = '';
var index = 0;
var i_emulation = 0;
var speed_timer = 1000;
var activity_started = false;

var secondi_totali = 0;
var minuti_totali = 0;
var tempo_str = '00:00:00';

var metri = 0;
var distance_two_point = 0;
var distance_two_point_loc = 0;

var velocita_istantanea_ms = 0;
var somma_velocita_istantanea_ms = 0;
var velocita_media_ms = 0;

var velocita_istantanea_kmh = 0;
var velocita_media_kmh = 0;

var calorie = 0;
var gr_persi = 0;