var UserProvider = require('../providers/providers').UserProvider;
var utils = require("../config/utils");
var config = require("../config/config");
var time = require('time')(Date);
//var locale = require("locale");

var userProvider = new UserProvider();

var root = function(req, res) {
    
    console.log('-- route index --');
    
    res.header("Content-Type", "text/html");
   
    var language = req.headers["accept-language"].substring(0,2);
    if(!(utils.inArray(language, config.web.supported_languages)))
        language = config.web.default_language;
        
    res.render(language + '/app/index', {
        title: "rungym - app index",
        header: "rungym - site under construction"
    });
}

var user = function(req, res) {
    
    userProvider.findByUsername(req.params.username, function(err, user){
    
        console.log('-- findByUsername index --');
        
        res.header("Content-Type", "text/html");
        
        var language = req.headers["accept-language"].substring(0,2);
        if(!(utils.inArray(language, config.web.supported_languages)))
            language = config.web.default_language;
        
        res.render(language + '/app/user', {
            title: "rungym - app user",
            header: "rungym - app user", 
            user: user
        });
        
    });
}

/** exports **/
exports.root = root;
exports.user = user;