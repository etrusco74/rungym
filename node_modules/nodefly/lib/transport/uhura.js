function debug(format, args) {
	var args = ['UHURA: ' + format].concat(args || []);
	if (/uhura/.test(process.env.NODEFLY_DEBUG) ) {
		console.log.apply(console, args);
	}
}

function verbose(format, args) {
	var args = ['UHURA: ' + format].concat(args || []);
	if (/uhura_verbose/.test(process.env.NODEFLY_DEBUG) ) {
		console.log.apply(console, args);
	}
}

var Uhura = require('uhura')
	, util = require('util')
	, Url = require('url');

var config = global.nodeflyConfig;

function Transport (options) {
	Uhura.Client.call(this);
	this.agent = options.agent;
	this.agentVersion = options.agentVersion;

	var url = Url.parse(config.server);
	this.connect(4567, url.hostname);
	this.autoReconnect();
	debug('Using url: %s', [config.server]);
}
util.inherits(Transport, Uhura.Client);

['update','instances','topCalls'].forEach(function (type) {
	Transport.prototype[type] = function (update) {
		var self = this;

		if ( ! self.sessionId) {
			return self.getSession(function () {
				self[type](update);
			});
		}

		debug('sending(%s)', [type]);
		verbose('%s', [util.inspect(update)]);
		this.send(type, update);
	};
});

Transport.prototype.getSession = function (callback) {
	var self = this;

	// we already have a session ID
	if (self.sessionId) {
		return callback(self.sessionId);
	}

	// we are trying to retrieve the session already just come back later for it
	if (self.retrievingSession) {
		return this.once('newSession', function () {
			process.nextTick(function () {
				self.getSession(callback);
			});
		});
	}

	self.retrievingSession = true;

	this.once('newSession', function (err, session) {
		if (err) {
			console.log('NODEFLY ERROR: could not establish session\n', err);
			self.sessionId = null;
			self.retrievingSession = false;
			return;
		}

		debug('got session');
		self.sessionId = self.agent.sessionId = session.sessionId;
		self.agent.appHash = session.appHash;
		self.retrievingSession = false;
		callback(self.sessionId);
	});

	debug('requesting session');
	this.send('createSession', {
		appName: this.agent.appName,
		hostname: this.agent.hostname,
		agentVersion: this.agentVersion,
		key: this.agent.key
	});
}

exports.init = function (options) {
	var transport = new Transport(options);
	transport.getSession(function () {});
	return transport;
}