var pomelo = require('pomelo');
var utils = require('../util/utils');

var systemDao = module.exports;

/**
 * Get account data by account.
 * @param {String} account
 * @param {String} passwd
 * @param {function} cb
 */
systemDao.getImageList = function (uid, cb) {
	var sql = 'select * from hackthon_img';
	var args = [];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

systemDao.getMusicList = function (uid, cb) {
	var sql = 'select * from hackthon_sound';
	var args = [];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};

systemDao.getDocumentList = function (uid, cb) {
	var sql = 'select * from hackthon_function';
	var args = [];
	pomelo.app.get('dbclient').query(sql,args,function(err, res) {
		if(err){
			utils.invokeCallback(cb, err, []);
		}else{
			utils.invokeCallback(cb, err, res);
		}
	});
};
