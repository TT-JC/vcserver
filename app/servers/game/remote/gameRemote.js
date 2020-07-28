var workDao = require('../../../dao/workDao');
var userDao = require('../../../dao/userDao');
var roomDao = require('../../../dao/roomDao');

module.exports = function(app) {
	return new GameRemote(app);
};

var GameRemote = function(app) {
	this.app = app;
};

GameRemote.prototype.newWork = function(uid,title,code,callback) {
	workDao.createWork(uid,title,code,function(err, work) {
		var data = {};
		data.work = work;
		callback(data);
	});
};

GameRemote.prototype.saveWork = function(uid,id,name,code,callback) {
	workDao.saveWork(uid,id,name,code,function(err, work) {
		var data = {};
		data.work = work;
		callback(data);
	});
};

GameRemote.prototype.renameWork = function(uid,id,name,callback) {
	workDao.renameWork(uid,id,name,function(err, work) {
		var data = {};
		data.work = work;
		callback(data);
	});
};

GameRemote.prototype.getWork = function(id,callback) {
	workDao.getWork(id,function(err, work) {
		var data = {};
		data.work = work;
		callback(data);
	});
};

GameRemote.prototype.deleteWork = function(id,callback) {
	workDao.deleteWork(id,function(err, work) {
		var data = {};
		data.id = id;
		callback(data);
	});
};

GameRemote.prototype.setTeacher = function(uid,callback) {
	userDao.setTeacher(uid,function(err, uid) {
		var data = {};
		data.id = uid;
		callback(data);
	});
};

GameRemote.prototype.setNickname = function(uid,name,callback) {
	userDao.setNickname(uid,name,function(err, uid) {
		callback(uid);
	});
};

GameRemote.prototype.getPages = function(id,callback) {
	workDao.getPages(id,function(err, pages) {
		var data = {};
		data.pages = pages;
		callback(data);
	});
};

GameRemote.prototype.publishPage = function(id,code,name,desText,callback) {
	workDao.publishPage(id,code,name,desText,function(err, page) {
		var data = {};
		data.page = page;
		callback(data);
	});
};

GameRemote.prototype.getPageByID = function(id,callback) {
	workDao.getPageByID(id,function(err, page) {
		var data = {};
		data.page = page;
		callback(data);
	});
};

GameRemote.prototype.addAmount = function(id, amount, callback) {
	workDao.addAmount(id, amount,function(err, page) {
		var data = {};
		data.page = page;
		callback(page);
	});
};

GameRemote.prototype.getClasses = function(id, callback) {
	roomDao.getClasses(id,function(err, datas) {
		var classes = [];
		for (var i=0;i<datas.length;i++){
			if(datas[i].isLive-0>0){
				classes.push(datas[i]);
			}
		}
		callback(classes);
	});
};
