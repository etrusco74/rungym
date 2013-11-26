var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var mongoose = require('mongoose');
var config = require('../config/config');
var uuid = require('node-uuid');

var db = mongoose.createConnection('mongodb://' + config.mongo.user + ':' + config.mongo.password + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db);


/** Model **/

/** story weight model **/
var storyWeightSchema = mongoose.Schema({
    weight      : String,
    date        : Date
});

/** user model **/
var userSchema = mongoose.Schema({
    first_name              :   String,
    last_name               :   String,
    username                :   { type: String, required: true, unique: true },
    password                :   { type: String, required: true },
    email                   :   { type: String, unique: true },
    registration_date       :   { type: Date, default: Date.now },
    auth                    :   {
                                    authkey         : String,
                                    ipaddress       : String,
                                    login_date      : { type: Date, default: Date.now }
                                },
    registration_weight     :   Number,
    born_date               :   Date,
    gender                  :   String,
    story_weight            :   [storyWeightSchema]
});

/** activity model **/
var activitySchema = mongoose.Schema({
    value               : Number,
    description         : String,
    sort                : Number
});


/** training model **/

var eventSchema = mongoose.Schema({
    coords                  :   {
        speed    			: Number,
        accuracy			: String,
        altitudeAccuracy	: String,
        altitude			: String,
        longitude			: Number,
        latitude			: Number,
        heading			    : String,
        event_date     		: Date
    },
    timestamp	: Number
});

var posSchema = mongoose.Schema({
    lng			: Number,
    lat			: Number
});


var trainingSchema = mongoose.Schema({
    username    		:  	{ type: String, required: true, ref:'userSchema'},
    start_date			:  	{ type: Date, required: true},
    end_date    		:  	Date,
    duration_str		:  	String,
    duration_sec		:	Number,
    duration_min		:   Number,
    speed_average_ms	:   Number,
    speed_average_kmh	:   Number,
    burned_calories		: 	Number,
    lose_gr			    : 	Number,
    total_meters		: 	Number,
    total_event			: 	Number,
    activity_id			:	{ type: mongoose.Schema.Types.ObjectId, required: true, ref:'Activity' },
    events			    :	[eventSchema],
    loc                 :   {
                                type: { 
                                    type: String 
                                }, 
                                coordinates: []
                            }
});

//trainingSchema.index({ loc: '2dsphere' });

var StoryWeight = db.model('StoryWeight', storyWeightSchema);
var User = db.model('User', userSchema);
var Activity = db.model('Activity', activitySchema);
var Training = db.model('Training', trainingSchema);

/** Provider **/

/** user provider **/
UserProvider = function(){};

/** Find all users **/
UserProvider.prototype.find = function(callback) {
    User.find({}, {password:0}, function (err, users) {
        if (err)    callback(err.message, null)
        else {
            if (users != null)  callback(null, users);
            else                callback('User not found', null);
        }
    });
};

/** Find user by ID **/
UserProvider.prototype.findById = function(id, callback) {
    User.findById(id, {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   callback( null, user.toObject() );
            else                callback( 'User not found', null);
        }
    });
};

/** Find user by username **/
UserProvider.prototype.findByUsername = function(username, callback) {
    User.findOne({'username': username}, {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   callback( null, user.toObject() );
            else                callback( 'User not found', null);
        }
    });
};

/** Check authKey by username **/
UserProvider.prototype.checkAuthKey = function(json, callback) {
    User.findOne({'auth.authkey': json.authKey}, {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   callback( null, user.toObject() );
            else                callback( 'AuthKey not found', null);
        }
    });
};

/** Create a new user by json data **/
UserProvider.prototype.save = function(json, ipAddress, callback) {
    var user = new User();
    if (!(typeof json.first_name === 'undefined') )     {
        user.first_name = json.first_name;
    }
    if (!(typeof json.last_name === 'undefined') )      {
        user.last_name = json.last_name;
    }
    if (!(typeof json.username === 'undefined') )       {
        user.username = json.username;
    }
    if (!(typeof json.password === 'undefined') )       {
        user.password = bcrypt.hashSync(json.password, salt);
    }
    if (!(typeof json.email === 'undefined') )          {
        user.email = json.email;
    }
    if (!(typeof json.registration_weight === 'undefined') )         {
        user.registration_weight = json.registration_weight;

        var storyWeight = new StoryWeight();
        storyWeight.weight = json.registration_weight;
        storyWeight.date = new Date();
        user.story_weight.push(storyWeight);
    }
    if (!(typeof json.born_date === 'undefined') )            {
        user.born_date = json.born_date;
    }
    if (!(typeof json.gender === 'undefined') )         {
        user.gender = json.gender;
    }

    user.auth.authkey = uuid.v1();
    user.auth.ipaddress = ipAddress;

    user.save(function (err, user) {
        if (err) callback(err.message, null)
        else {
            User.findOne({username: user.username}, {password:0}, function (err2, userRes) {
                if (err2)    callback(err2.message, null)
                else {
                    if (userRes != null)    callback(null, userRes);
                    else                    callback('User not found', null);
                }
            });
        }
    });
};

/** Login with username and password **/
UserProvider.prototype.login = function(json, ipAddress, callback) {
    User.findOne({username: json.username}, function (err, user) {
        if (err)    callback(err.message, null)
        else {
            if (user != null) {
                if (bcrypt.compareSync(json.password, user.password)) {

                    user.auth.authkey = uuid.v1();
                    user.auth.ipaddress = ipAddress;
                    user.auth.login_date = new Date();

                    user.save(function (err2, user) {
                        if (err2)   callback(err2.message, null);
                        else {
                            User.findOne({username: user.username}, {password:0}, function (err3, userNoPwd) {
                                if (err3)   callback(err3.message, null)
                                else        callback(null, userNoPwd);
                            });
                        }
                    });

                }
                else    callback('Wrong Password', null);
            }
            else    callback('User not found', null);
        }
    });
};

/** Update user by json data **/
UserProvider.prototype.updateById = function(id, json, callback) {
    User.findById(id, function (err, user) {
        if (err) callback(err.message, null)
        else {
            if (user != null) {

                if (!(typeof json.first_name === 'undefined') )     {
                    user.first_name = json.first_name;
                }
                if (!(typeof json.last_name === 'undefined') )      {
                    user.last_name = json.last_name;
                }
                if (!(typeof json.username === 'undefined') )       {
                    user.username = json.username;
                }
                if (!(typeof json.password === 'undefined') )       {
                    user.password = bcrypt.hashSync(json.password, salt);
                }
                if (!(typeof json.email === 'undefined') )          {
                    user.email = json.email;
                }
                if (!(typeof json.story_weight === 'undefined') )  {
                    
                    var storyWeight = new StoryWeight();
                    storyWeight.weight = json.story_weight;
                    storyWeight.date = new Date();
                    
                    user.story_weight.push(storyWeight);
                    
                    var doc = user.story_weight[1];
                    console.log(doc) 
                    doc.isNew; 
                    
                }
                if (!(typeof json.born_date === 'undefined') )            {
                    user.born_date = json.born_date;
                }
                if (!(typeof json.gender === 'undefined') )         {
                    user.gender = json.gender;
                }

                user.save(function (err2, user) {
                    if (err2) callback(err2.message, null)
                    else {
                        User.findOne({username: user.username}, {password:0}, function (err3, userRes) {
                            if (err3)    callback(err3.message, null)
                            else {
                                if (userRes != null)    callback(null, userRes);
                                else                    callback('User not found', null);
                            }
                        });
                    }
                });
            }
            else callback(null, null);
            }
    });
};

/** Delete All users **/
UserProvider.prototype.delete = function(callback) {
    User.remove(function (err) {
        if (err) callback(err.message)
        else callback(null);
    });
};

/** Delete user by id **/
UserProvider.prototype.deleteById = function(id, callback) {
    User.findById(id, {password:0}, function (err, user) {
        if (err) callback(err.message, null)
        else {
            if (user != null) {
                user.remove(function (err2) {
                        if (err2) callback(err2.message)
                        else callback(null);
                    });
            }
            else callback(null);
            }
    });
};


/** activity provider **/
ActivityProvider = function(){};

/** Find all activities **/
ActivityProvider.prototype.find = function(callback) {
    var query = Activity.find({});
    query.sort({sort: 'asc'});
    query.exec(function (err, activities) {
    //Activity.find({}, function (err, activities) {
        if (err)    callback(err.message, null)
        else {
            if (activities != null)  callback(null, activities);
            else                        callback('Activities not found', null);
        }
    });
};

/** Find activity by id **/
ActivityProvider.prototype.findById = function(id, callback) {
    Activity.findById(id, function (err, activity) {
        if (err)    callback(err.message, null)
        else {
            if (activity != null)   callback(null, activity);
            else                    callback('Activity not found', null);
        }
    });
};


/** training provider **/
TrainingProvider = function(){};

/** Create a new training by json data **/
TrainingProvider.prototype.save = function(json, ipAddress, callback) {
    var training = new Training(json);
    
    training.save(function (err, trainingRes) {
        if (err) 	callback(err.message, null)
        else 		{
            
            callback(null, trainingRes);
                        
            /** esempi di query geometriche **/
            /* tutti gli allenamenti vicino al un punto (12.55,41.97) */
            /*            
            var geojsonPoint = { type: 'Point', coordinates: [12.55, 41.97] }
            Training.find({ loc: { $near: { $geometry: geojsonPoint }}}, function (err2, trainingRes) {
                if (err2)    callback(err2.message, null)
                else {
                    if (trainingRes != null)    callback(null, trainingRes);
                    else                        callback('Training not found', null);
                }
            });
            */
        }
    });
};

exports.UserProvider = UserProvider;
exports.ActivityProvider = ActivityProvider;
exports.TrainingProvider = TrainingProvider;