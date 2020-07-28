var userDao = require('../../../dao/userDao');
var async = require('async');

module.exports = function(app) {
	return new LoginRemote(app);
};

var LoginRemote = function(app) {
	this.app = app;
};

LoginRemote.prototype.login = function(uid,cell,callback) {
	var loginData;
	async.waterfall([
		function(cb) {
			userDao.getUserInfo(uid,function(err, info) {
				cb(err,info);
			});
		},
		function(info, cb) {
			console.log(info.userinfo);
			if(!info.userinfo){
				userDao.createUser(uid,cell,function(err, info) {
					loginData = info;
					cb(err);
				});
			}else{
				loginData = info;
				cb(err);
			}
		},
		function(cb) {
			userDao.getRoomInfo(uid,function(err, room) {
				loginData.roomname = room;
				cb(err);
			});
		}
	], function(err) {
		if(err) {
			console.log(err);
			callback(null);
			return;
		}
		callback(loginData);
	});
};	
