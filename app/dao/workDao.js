var pomelo = require('pomelo');
var utils = require('../util/utils');
var async = require('async');

var workDao = module.exports;

/**
 * Get account data by account.
 * @param {String} account
 * @param {String} passwd
 * @param {function} cb
 */
workDao.getWorkList = function (uid, cb) {
	var sql = 'select * from user_works where uid = ?';
	var args = [uid];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

workDao.createWork = function (uid,name,code,cb) {
	var sql,args,hasWork,data;
	async.series([
		function(callback){
			sql = 'select * from user_works where uid = ? and wname = ?';
			args = [uid,name];
			pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
				if (res==null) hasWork = true;
				else hasWork = false;
				callback(err);
			});
		},
		function(callback){
			if(hasWork){
				sql = 'insert into user_works (uid,wname,codes,createTime,updateTime) values(?,?,?,?,?)';
				time = Math.floor(new Date().getTime()/1000);
				args = [uid,name,code,time,time];
				pomelo.app.get('dbclient').query(sql,args,function(err, res) {
					if(err){
						data = null;
					}else{
						data = {"id":res.insertId,"uid":uid,"codes":code,"wname":name,"createTime":time,"updateTime":time};
					}
					callback(err);
				});
			}else{
				data = null;
				callback(err);
			}
		}
	],function(err,results) {
		utils.invokeCallback(cb, err, data);
	});
};

workDao.renameWork = function (uid,id,name,cb) {
	var sql,args,hasWork,data;
	async.series([
		function(callback){
			sql = 'select * from user_works where uid = ? and wname = ?';
			args = [uid,name];
			pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
				if (res==null) hasWork = true;
				else hasWork = false;
				callback(err);
			});
		},
		function(callback){
			if(hasWork){
				sql = 'update user_works set wname = ? where id = ?';
				args = [name,id];
				pomelo.app.get('dbclient').query(sql,args,function(err, res) {
					if(err){
						data = null;
					}else{
						data = {"id":id,"uid":uid,"wname":name};
					}
					callback(err);
				});
			}else{
				data = null;
				callback(err);
			}
		}
	],function(err,results) {
		utils.invokeCallback(cb, err, data);
	});
};

workDao.saveWork = function (uid,id,name,code,cb) {
	var sql,args,hasWork,data;
	var time = Math.floor(new Date().getTime()/1000);
	async.series([
		function(callback){
			sql = 'select * from user_works where uid = ? and wname = ?';
			args = [uid,name];
			pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
				if (res==null) hasWork = true;
				else hasWork = false;
				callback(err);
			});
		},
		function(callback){
			if(hasWork){
				sql = 'insert into user_works (uid,wname,codes,createTime,updateTime) values(?,?,?,?,?)';
				args = [uid,name,code,time,time];
				pomelo.app.get('dbclient').query(sql,args,function(err, res) {
					id = res.insertId;
					callback(err);
				});
			}else{
				callback(err);
			}
		},
		function(callback){
			sql = 'update user_works set wname = ?,codes = ?,updateTime = ? where id = ?';
			args = [name,code,time,id];
			pomelo.app.get('dbclient').query(sql,args,function(err, res) {
				if(err)data = null;
				else data = {"id":id,"uid":uid,"codes":code,"wname":name,"updateTime":time};
				callback(err);
			});
		}
	],function(err,results) {
		utils.invokeCallback(cb, err, data);
	});
};

workDao.getWork = function (id, cb) {
	var sql = 'select * from user_works where id = ?';
	var args = [id];
	pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

workDao.deleteWork = function (id, cb) {
	var sql = 'delete from user_works where id = ?';
	var args = [id];
	pomelo.app.get('dbclient').delete(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

workDao.getPages = function (id, cb) {
	var sql = 'select * from system_user_pages';
	var args = [];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

workDao.addAmount = function (id, amount, cb) {
	var sql = 'update system_user_pages set '+amount+' = '+amount+' + 1 where id = ?';
	var args = [id];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, null);
		}else{
			utils.invokeCallback(cb, err, id);
		}
	});
};

workDao.publishPage = function (uid,code,name,desText, cb) {
	var sql,args,nickName = "",data,publishid;
	async.series([
		function(callback){
			sql = 'select * from user_info where id = ?';
			args = [uid];
			pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
				nickName = res.nickName;
				callback(err);
			});
		},function(callback){
			sql = 'insert into system_user_pages (uid,wname,nickName,desText,updateTime) values(?,?,?,?,?)';
			var time = Math.floor(new Date().getTime()/1000);
			args = [uid,name,nickName,desText,time];
			pomelo.app.get('dbclient').query(sql,args,function(err, res) {
				if(err){
					data = null;
				}else{
					publishid = res.insertId;
					data = {"id":publishid,"uid":uid,"codes":code,"wname":name,"des-text":desText,"updateTime":time};
				}
				callback(err);
			});
		},function(callback){
			if(publishid>0){
				sql = 'insert into system_user_pages_codes (id,code) values(?,?)';
				args = [publishid,code];
				pomelo.app.get('dbclient').query(sql,args,function(err, res) {
					callback(err);
				});
			}else callback(err);
		}
	],function(err,results) {
		utils.invokeCallback(cb, err, data);
	});
};

workDao.getPageByID = function (id, cb) {
	var sql = 'select * from system_user_pages_codes where id = ?';
	var args = [id];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};