var roomDao = require('../../../dao/roomDao');
var userDao = require('../../../dao/userDao');
var async = require('async');

module.exports = function(app) {
	return new ChatRemote(app);
};

var ChatRemote = function(app) {
	this.app = app;
};

ChatRemote.prototype.create = function(uid, roomname, callback) {
	roomDao.create(uid,roomname,function(err, data){
		callback(data);
	});
}

ChatRemote.prototype.saveToken = function(uid, token, callback) {
	userDao.saveToken(uid,token,function(err, data) {
		callback(data);
	});
}

ChatRemote.prototype.join = function(uid, roomname, callback) {
	roomDao.join(uid,roomname,function(err, data) {
		callback(data);
	});
}

