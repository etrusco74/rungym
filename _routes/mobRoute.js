var UserProvider = require('../providers/providers').UserProvider;
var utils = require("../config/utils");
var config = require("../config/config");
var time = require('time')(Date);
var pjson = require('../package.json');
//var locale = require("locale");

var userProvider = new UserProvider();

var root = function(req, res) {
    console.log('-- mobile route index --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/index', {
        title: "rungym - mobile - index",
        header: "indice",
        version: pjson.version
    });
}

var login = function(req, res) {
    console.log('-- mobile route login --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/login', {
        title: "rungym - mobile - login",
        header: "login"
    });
}

var logout = function(req, res) {
    console.log('-- mobile route logout --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/logout', {
        title: "rungym - mobile - logout",
        header: "logout"
    });
}

var registration = function(req, res) {
    console.log('-- mobile route registration --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/registration', {
        title: "rungym - mobile - registrazione nuovo utente",
        header: "registrazione"
    });
}

var dashboard = function(req, res) {
    console.log('-- mobile route dashboard --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/dashboard', {
        title: "rungym - mobile - dashboard",
        header: "dashboard"
    });
}

var profile = function(req, res) {
    console.log('-- mobile route profile --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/profile', {
        title: "rungym - mobile - profile",
        header: "profilo utente"
    });

}

var activity = function(req, res) {
    console.log('-- mobile route activity --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/activity', {
        title: "rungym - mobile - activity",
        header: "attività sportiva"
    });
}

var training = function(req, res) {
    console.log('-- mobile route training --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;
    
    res.render(language + '/mob/training', {
        title: "rungym - mobile - training",
        header: "allenamento"
    });
}

var send = function(req, res) {
    console.log('-- mobile route send --');

    res.header("Content-Type", "text/html");

    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;

    res.render(language + '/mob/send', {
        title: "rungym - mobile - send data",
        header: "Trasferisci allenamento"
    });
}


/** exports **/
exports.root = root;
exports.login = login;
exports.logout = logout
exports.registration = registration;
exports.dashboard = dashboard;
exports.profile = profile;
exports.activity = activity;
exports.training = training;
exports.send = send;