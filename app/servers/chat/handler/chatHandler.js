var chatRemote = require('../remote/chatRemote');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.getToken = function(msg, session, next) {
	var uid = msg.uid;
	var http = require('https');
	var querystring = require('querystring');
	var contents = querystring.stringify({accid: "llid_"+uid});
	var curTime = ""+Math.floor(new Date().getTime()/1000);
	var crypto = require('crypto');
	var md5sum = crypto.createHash('sha1');
	md5sum.update("62750cc556cc" + "12345" + curTime)
	var checkSum = md5sum.digest('hex');
	var options = {
	    host: 'api.netease.im',
	    path: '/nimserver/user/create.action',
	    method: 'POST',
	    headers: {
	    	'AppKey':'c7382d09ba8b311cfac1c1e870035cf0',
	    	'Nonce':'12345',
	    	'CurTime':curTime,
	    	'CheckSum':checkSum,
	        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
	        "Content-Length": contents.length
	    }
	};
	var that = this;
	var req = http.request(options, function(res){
	    res.setEncoding('utf8');
	    res.on('data', function(data){
	    	var dat = eval("(" + data + ")");
	    	if(dat.code==200){
	    		that.app.rpc.chat.chatRemote.saveToken(session,uid,dat.info.token,function(res){

	    		});
	    		next(null, {
					code: 200,
					data: dat
				});
	    	}else{
	    		next(null, {
					code: 300
				});
	    	}
	    });
	});
	req.write(contents);
	req.end();
}

Handler.prototype.create = function(msg, session, next) {
	var uid = msg.uid;
	var roomname = msg.room;
	var _this = this;
	
	this.app.rpc.chat.chatRemote.create(session,uid,roomname, function(res){
		if(!res){
			next(null, {
				code: 500
			});
		}else{
			next(null, {
				code: 200,
				data: res
			});
		}
	});
}
