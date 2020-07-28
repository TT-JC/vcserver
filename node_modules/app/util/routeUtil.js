var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.game = function(session, msg, app, cb) {
	var gameServers = app.getServersByType('game');
	
	if(!gameServers || gameServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('uid'), gameServers);

	cb(null, res.id);
};

exp.chat = function(session, msg, app, cb) {
	var gameServers = app.getServersByType('chat');
	
	if(!gameServers || gameServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('uid'), gameServers);
	cb(null, res.id);
};