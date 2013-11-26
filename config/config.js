var config = {}

config.mongo = {};
config.web = {};

/** mongolab **/
//config.mongo.host = 'ds051447.mongolab.com';
//config.mongo.port = 51447;
/** mongohq **/
config.mongo.host = 'dharma.mongohq.com';       
config.mongo.port = 10073;

config.mongo.db = 'rungym';
config.mongo.user = 'etrusco'
config.mongo.password = 'sandrino';

config.web.port = process.env.PORT || 80;
config.web.ip = process.env.IP;
config.web.supported_languages = ["en", "it"];
config.web.default_language = ["en"];

module.exports = config;