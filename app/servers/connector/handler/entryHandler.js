
module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
	this.channelService = app.get('channelService');
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.enter = function(msg, session, next) {
	var self = this;
	var uid = msg.uid;
	var cell = msg.cell;
	if(!uid) {
		next(null, {
			code: 502
		});
		return;
	}
	/*var sessionService = self.app.get('sessionService');
	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 501,
			error: true
		});
		return;
	}*/
	session.bind(uid);
	session.set('uid', uid);
	session.push('uid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));
	var channel = this.channelService.getChannel("game", true);
	var sid = this.app.get('serverId');
	channel.add(uid, sid);

	this.app.rpc.game.loginRemote.login(session,uid,cell, function(data){
		if(!data){
			next(null, {
				code: 500
			});
			return;
		}
		next(null, {
			code: 200,
			data: data
		})});
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
};

Handler.prototype.join = function(msg, session, next) {
	var uid = msg.uid;
	var roomname = msg.room;
	var _this = this;
	this.app.rpc.chat.chatRemote.join(session,uid,roomname, function(res){
		if(!res){
			next(null, {
				code: 500
			});
			return;
		}
		var roomID = "llroom_"+res.info.id;
		var channel = _this.channelService.getChannel(roomID, true);
		var param = {
			route: 'onJoin',
			uid:uid,
			msg:res.list
		};
		channel.pushMessage(param);

		if( !! channel) {
			session.set('rid', roomID);
			var sid = _this.app.get('serverId');
			if(channel.getMember(uid)==null) channel.add(uid, sid);
			next(null, {
				code: 200,
				data: res
			});
		}else{
			next(null, {
				code: 501
			});
		}
	});
};

Handler.prototype.leave = function(msg, session, next) {
	var uid = msg.uid;
	var roomname = msg.room;
	var channel = this.channelService.getChannel(roomname, true);
	var param = {
		route: 'onLeave',
		msg: {"uid":uid,"roomname":roomname}
	};
	channel.pushMessage(param);
	var _this = this;
	if( !! channel) {
		session.set('rid', roomname);
		var sid = _this.app.get('serverId');
		channel.leave(uid, sid);
		next(null, {
			code: 200,
			data: 1
		});
	}else{
		next(null, {
			code: 501
		});
	}
};

Handler.prototype.send = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onChat',
		msg: {"vip":msg.vip,"name":msg.name,"content":msg.content}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.choose = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onChoose',
		msg: {"uid":msg.id}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.handstop = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onHandStop',
		msg: {"uid":msg.id}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.handup = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onHandup',
		msg: {"uid":msg.uid}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.handdown = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onHanddown',
		msg: {"uid":msg.uid}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.mouseClick = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onMouseClick',
		msg: {"type":msg.type,"x":msg.x,"y":msg.y}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.onStudent = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onStudentOn',
		msg: {"uid":msg.uid}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.offStudent = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onStudentOff',
		msg: {"uid":msg.uid}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.lookCode = function(msg, session, next) {
	var param = {target: msg.uid};
	var channel = this.channelService.getChannel("game", false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onLook', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.stopLookCode = function(msg, session, next) {
	var param = {target: msg.uid};
	var channel = this.channelService.getChannel("game", false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onLookStop', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.workGood = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onGoodSay',
		msg: {"id":msg.id}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.refreshPC = function(msg, session, next) {
	var param = {};
	var channel = this.channelService.getChannel("game", false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onRefresh', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.invite = function(msg, session, next) {
	var param = {
		name:msg.name,
		rid:msg.room
	};
	var channel = this.channelService.getChannel("game", false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onInvited', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.beginClass = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onClassBegin',
		msg: {"code":msg.code,"gap":msg.gap}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.endClass = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onClassEnd',
		msg: {"class":0}
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.workToC = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		route: 'onWorkUpdate',
		code:msg.code,
		uid:msg.uid
	};
	var channel = this.channelService.getChannel(rid, false);
	channel.pushMessage(param);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.workToB = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		uid:msg.uid,
		code:msg.code
	};
	var channel = this.channelService.getChannel(rid, false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onWorkUpdate', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.codeCtrl = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		target: msg.uid
	};
	var channel = this.channelService.getChannel(rid, false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onCtrl', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.stopCtrl = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		target: msg.uid
	};
	var channel = this.channelService.getChannel(rid, false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onCtrlStop', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};

Handler.prototype.upCode = function(msg, session, next) {
	var rid = msg.room;
	var param = {
		uid:msg.uid,
		name:msg.nickName,
		code: msg.code
	};
	var channel = this.channelService.getChannel(rid, false);
	var tsid = channel.getMember(msg.id)['sid'];
	this.channelService.pushMessageByUids('onCodeUp', param, [{
		uid: msg.id,
		sid: tsid
	}]);
	next(null, {
		code: 200,
		data: msg
	});
};