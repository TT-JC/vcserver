
module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.setTeacher = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.setTeacher(session,uid, function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
}

handler.setNickname = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.setNickname(session,uid,msg.name, function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
}

handler.newWork = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.newWork(session,uid,msg.title,msg.code, function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.cloneWork = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.newWork(session,uid,msg.title,msg.code, function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.autoSaveWork = function(msg, session, next) {
	var uid = session.get('uid');
	if(msg.uid==null) msg.uid = uid;
	this.app.rpc.game.gameRemote.saveWork(session,msg.uid,msg.id,msg.name,msg.code,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.saveWork = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.saveWork(session,uid,msg.id,msg.name,msg.code,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.renameWork = function(msg, session, next) {
	var uid = session.get('uid');
	this.app.rpc.game.gameRemote.renameWork(session,uid,msg.id,msg.name,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.getWork = function(msg, session, next) {
	this.app.rpc.game.gameRemote.getWork(session,msg.id,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.deleteWork = function(msg, session, next) {
	this.app.rpc.game.gameRemote.deleteWork(session,msg.id,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.getPages = function(msg, session, next) {
	this.app.rpc.game.gameRemote.getPages(session,msg.uid,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.publishPage = function(msg, session, next) {
	this.app.rpc.game.gameRemote.publishPage(session,msg.uid,msg.code,msg.name,msg.desText,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.getPageByID = function(msg, session, next) {
	this.app.rpc.game.gameRemote.getPageByID(session,msg.id,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.addAmount = function(msg, session, next) {
	this.app.rpc.game.gameRemote.addAmount(session,msg.id,msg.type,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: res
		});
	});
};

handler.getClasses = function(msg, session, next) {
	this.app.rpc.game.gameRemote.getClasses(session,msg.uid,function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		var dat = {};
		dat.nowTime = Math.floor(new Date().getTime()/1000);
		dat.classes = res;
		next(null, {
			code: 200,
			data: dat
		});
	});
};
