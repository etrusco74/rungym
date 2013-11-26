var express = require('express');
var path = require('path');
var http = require('http');
var config = require('./config/config');
var api = require('./api/api');
//var appRoute = require('./routes/appRoute');
//var mobRoute = require('./routes/mobRoute');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.compress()),
    app.use(express.methodOverride()),
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
    //app.engine('.html', require('ejs').__express);
    app.set('ip', config.web.ip);
    app.set('port', config.web.port);
    //app.set('views', __dirname + '/views');
    //app.set('view engine', 'html');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

console.log(app.get('env'));

/** cross domain request **/
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, authkey');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

/** mobile route view **/
/*
app.get('/mob', mobRoute.root);
app.get('/mob/login', mobRoute.login);
app.get('/mob/logout', mobRoute.logout);
app.get('/mob/registration', mobRoute.registration);
app.get('/mob/dashboard', mobRoute.dashboard);
app.get('/mob/profile', mobRoute.profile);
app.get('/mob/activity', mobRoute.activity);
app.get('/mob/training', mobRoute.training);
app.get('/mob/send', mobRoute.send);
*/

/** app route view **/
/*
app.get('/', appRoute.root);
app.get('/user/username/:username', appRoute.user);
*/

/** api route - RESTful webservice **/
app.get('/api/users', api.findUsers);
app.get('/api/user/id/:id', api.findUserById);
app.get('/api/user/username/:username', api.findUserByUsername);
app.get('/api/activities', api.findActivities);
app.get('/api/activity/id/:id', api.findActivityById);

app.post('/api/user', api.saveUser);
app.post('/api/login', api.login);
app.post('/api/training', api.saveTraining);

app.put('/api/user/id/:id', api.updateUserById);

app.delete('/api/user/id/:id', api.deleteUserById);
app.delete('/api/users', api.deleteUsers);

/** 404 error **/
app.all('*', function(req, res){
  res.send('mmmmhhh!!! ... ', 404);
});

console.log("Express server will be listening on " + app.get('ip') + ":" + app.get('port'));
http.createServer(app).listen(app.get('port'), app.get('ip'), function () {
    console.log("Express server started and listening on " + app.get('ip') + ":" + app.get('port'));
});
