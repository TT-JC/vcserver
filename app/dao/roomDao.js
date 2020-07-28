var pomelo = require('pomelo');
var utils = require('../util/utils');
var async = require('async');

var roomDao = module.exports;

/**
 * Get account data by account.
 * @param {String} account
 * @param {String} passwd
 * @param {function} cb
 */
roomDao.create = function (uid, roomname, cb) {
	var connection = pomelo.app.get('dbclient');
	var list = {},sql,args,roomid;
	async.series([
		function(callback){
			sql = 'delete from game_classroom_user where roomname = ?';
			args = [roomname];
			connection.delete(sql,args,function(err, res) {
				callback(err);
			});
		},function(callback){
			sql = 'delete from game_classroom_info where roomname = ?';
			args = [roomname];
			connection.delete(sql,args,function(err, res) {
				callback(err);
			});
		},function(callback){
			sql = 'insert into game_classroom_info (uid,roomname,createTime) values(?,?,?)';
			var time = Math.floor(new Date().getTime()/1000);
			args = [uid, roomname, time];
			connection.query(sql,args,function(err, res) {
				roomid = res.insertId;
				callback(err);
			});
		}],function(err,results) {
			utils.invokeCallback(cb, err, {"id":roomid,"roomname":roomname});
	});
};


roomDao.join = function (uid, roomname, cb) {
	var connection = pomelo.app.get('dbclient');
	var list = {},sql,args,data = {};
	async.series([
		function(callback){
			sql = 'select * from game_classroom_info where roomname = ?';
			args = [roomname];
			connection.queryOne(sql,args,function(err, res) {
				if (!!res) data = res;
				callback(err);
			});
		},function(callback){
			sql = 'select * from game_classroom_user where roomname = ?';
			args = [roomname];
			connection.query(sql,args,function(err, res) {
				list = res;
				callback(err);
			});
		}],function(err,results) {
			data.curTime = Math.floor(new Date().getTime()/1000);
			utils.invokeCallback(cb, err, {"list":list,"roomname":roomname,"info":data});
	});
};

roomDao.getClasses = function (uid, cb) {
	var connection = pomelo.app.get('dbclient');
	var sql = 'select * from game_classroom_user where uid = ?';
	var args = [uid];
	connection.query(sql,args,function(err, res) {
		async.mapSeries(res, function(node,cb){
			sql = 'select * from game_classroom_info where roomname = ?';
			args = [node.roomname];
			connection.queryOne(sql,args,function(err, res) {
				cb(null,res);
			});
		}, function(err,results){
			utils.invokeCallback(cb, err, results);
		});
	});
};

