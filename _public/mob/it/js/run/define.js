/** API URL **/
var debug = false;

/** development, production **/
//var env = 'development'; 
var env = 'production';

var domain = '';
(env == 'development') ? domain = 'http://rungym.etrusco.c9.io' : domain = 'http://www.rungym.com';

var apiurl = domain + '/api/';
var testJsonUrl = domain + '/mob/events.json';

/** GLOBAL VARIABLE - MODEL **/
var User = Model("user", function() {
  this.persistence(Model.localStorage)
});
var user;

var Training = Model("training", function() {
  this.persistence(Model.localStorage)
});
var training;

/** TRAINING VARIABLES **/
var event;
var timer;
var training_active = false;

var tex_res = '';
var i_emulation = 0;
var speed_timer = 1000;
var activity_started = false;

var secondi_totali = 0;
var minuti_totali = 0;
var tempo_str = '00:00:00';

var total_distance_str = '0';
var total_distance_km = 0;
var total_distance_m = 0;
var distance_two_point_km = 0;

var velocita_istantanea_ms = 0;
var somma_velocita_istantanea_ms = 0;
var velocita_media_ms = 0;

var velocita_istantanea_kmh = 0;
var velocita_media_kmh = 0;

var calorie = 0;
var gr_persi = 0;