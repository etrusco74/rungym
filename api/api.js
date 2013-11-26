var UserProvider = require('../providers/providers').UserProvider;
var ActivityProvider = require('../providers/providers').ActivityProvider;
var TrainingProvider = require('../providers/providers').TrainingProvider;

var utils = require("../config/utils");
var time = require('time')(Date);

var userProvider = new UserProvider();
var activityProvider = new ActivityProvider();
var trainingProvider = new TrainingProvider

/** USER API **/

/** get method **/

/** findUsers - private **/
var findUsers = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUsers - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUsers';
    authObj.verb = 'GET';

    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.find(function(err, users){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (users.length != 0) {
                            res.send(JSON.stringify(users));
                            console.log('Users: ' + JSON.stringify(users));
                            //FIXME - togliere, esempio per Time Zone
                            /*
                            var data_iscrizione = new time.Date(users[0].data);
                            console.log('Server TimeZone' + data_iscrizione.getTimezone());
                            data_iscrizione.setTimezone('Europe/Rome');
                            console.log('Data in current TimeZone: ' + data_iscrizione.toString());
                            */
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No users found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/** findUserById - private **/
var findUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUserById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUserById';
    authObj.verb = 'GET';
    authObj.id = req.params.id;

    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.findById(authObj.id, function(err, user){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (user) {
                            res.send(JSON.stringify(user));
                            console.log('Users: ' + JSON.stringify(user));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/** findUserByUsername - private **/
var findUserByUsername = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUserByUsername - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUserByUsername';
    authObj.verb = 'GET';
    authObj.username = req.params.username;

    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.findByUsername(authObj.username, function(err, user){
                    if (err) {
                        authObj.isAuth = true;
                        console.log('authObj: ' + JSON.stringify(authObj));
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (user) {
                            res.send(JSON.stringify(user));
                            console.log('Users: ' + JSON.stringify(user));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/** post method **/

/** saveUser - public **/
var saveUser = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;

    console.log('------------------- POST - api saveUser -public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'saveUser';
    authObj.verb = 'POST';
    console.log('request body: ' + JSON.stringify(userReq));
    console.log('authObj: ' + JSON.stringify(authObj));

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    userProvider.save(userReq, authObj.ipAddress, function(err, userRes){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            jsonObj.success = true;
            jsonObj.user    = userRes;
            res.send(jsonObj);
            console.log('Registration ok');
            console.log('User: ' + JSON.stringify(userRes));
        }
    })
}

/** login - public **/
var login = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    
    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;

    console.log('------------------- POST - api login -public  --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'login';
    authObj.verb = 'POST';
    console.log('request body: ' + JSON.stringify(userReq));
    console.log('authObj: ' + JSON.stringify(authObj));

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    if (typeof userReq.username === 'undefined')       {
        jsonObj.success = false;
        jsonObj.error = 'username required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    if (typeof userReq.password === 'undefined')       {
        jsonObj.success = false;
        jsonObj.error = 'password required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    userProvider.login(userReq, authObj.ipAddress, function(err, userRes){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (userRes != null) {
                jsonObj.success = true;
                jsonObj.user    = userRes;
                res.send(jsonObj);
                console.log('Login ok');
                console.log('User: ' + JSON.stringify(userRes));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = "Login Failed";
                res.send(jsonObj);
                console.log('Login Failed');
            }
        }
    })
}

/** put method **/

/** updateUserById - private **/
var updateUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;

    console.log('------------------- PUT - api updateUserById -private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'updateUserById';
    authObj.verb = 'PUT';
    authObj.id = req.params.id;
    console.log('request body: ' + JSON.stringify(userReq));

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }

    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));

                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.updateById(authObj.id, userReq, function(err, userRes){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (userRes) {
                            jsonObj.success = true;
                            jsonObj.user = userRes;
                            res.send(jsonObj);
                            console.log('User updated');
                            console.log('User: ' + JSON.stringify(userRes));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
}

/** delete method **/

/** deleteUsers - private **/
var deleteUsers = function(req, res) {

   res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- DELETE - api deleteUsers - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteUsers';
    authObj.verb = 'DELETE';

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }
    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.delete(function(err){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.desc = 'All Users deleted';
                        res.send(jsonObj);
                        console.log('All Users deleted');
                    }
                })
            }
        })
    }
}

/** deleteUserById - private **/
var deleteUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- DELETE - api deleteUserById private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteUserById';
    authObj.verb = 'DELETE';
    authObj.id = req.params.id;

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }
    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.deleteById(authObj.id, function(err){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.desc = 'User deleted';
                        res.send(jsonObj);
                        console.log('User deleted');
                    }
                })
            }
        })
    }
}

/** ACTIVITY API **/

/** get method **/

/** findActivities - public **/
var findActivities = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findActivities - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findActivities';
    authObj.verb = 'GET';

    activityProvider.find(function(err, activities){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (activities.length != 0) {
                res.send(JSON.stringify(activities));
                console.log('Activities: ' + JSON.stringify(activities));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No activities found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })
};

/** findActivityById - public **/
var findActivityById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findActivityById - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findActivities';
    authObj.verb = 'GET';
    authObj.id = req.params.id;

    activityProvider.findById(authObj.id, function(err, activity){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (activity.length != 0) {
                res.send(JSON.stringify(activity));
                console.log('activity: ' + JSON.stringify(activity));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No activity found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })
};

/** TRAINING API **/

/** saveTraining - private **/
var saveTraining = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var trainingReq = req.body;

    console.log('------------------- POST - api saveTraining - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'saveTraining';
    authObj.verb = 'POST';
    console.log('request body: ' + JSON.stringify(trainingReq));
    console.log('authObj: ' + JSON.stringify(authObj));

    if (req.get('content-type') != 'application/json')   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    if (typeof req.headers.authkey === 'undefined')   {
        jsonObj.success = false;
        jsonObj.error = 'authkey required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
                console.log('authObj: ' + JSON.stringify(authObj));
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                trainingProvider.save(trainingReq, authObj.ipAddress, function(err, trainingRes){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success     = true;
                        jsonObj.training    = trainingRes;
                        res.send(jsonObj);
                        console.log('Registration Training ok');
                        console.log('Training: ' + JSON.stringify(trainingRes));
                    }
                })
                
            }
        })
    
    }    
}

/** exports **/
exports.findUsers = findUsers;
exports.findUserById = findUserById;
exports.findUserByUsername = findUserByUsername;
exports.saveUser = saveUser;
exports.login = login;
exports.updateUserById = updateUserById;
exports.deleteUsers = deleteUsers;
exports.deleteUserById = deleteUserById;

exports.findActivities = findActivities;
exports.findActivityById = findActivityById;

exports.saveTraining = saveTraining;