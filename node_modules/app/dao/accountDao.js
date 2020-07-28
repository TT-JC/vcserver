var pomelo = require('pomelo');
var utils = require('../util/utils');

var accountDao = module.exports;

/**
 * Get account data by account.
 * @param {String} account
 * @param {String} passwd
 * @param {function} cb
 */
accountDao.getAccountInfo = function (account, cb) {
	var sql = 'select * from system_user_info where username = ?';
	var args = [account];
	pomelo.app.get('dbclient').queryOne(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, null);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

accountDao.createAccount = function (account, cb) {
	var sql = 'insert into system_user_info (username, createTime) values(?,?)';
	var time = Math.floor(new Date().getTime()/1000);
	var args = [account,time];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, null);
		}else{
			utils.invokeCallback(cb, err, {"id":res.insertId,"account":account,"createTime":time});
		}
	});
};