var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var utils = require('../util/utils');
var async = require('async');
var configUtil = require('../util/configUtil');

var workDao = require('./workDao');
var systemDao = require('./systemDao');

var userDao = module.exports;

userDao.getUserInfo = function (uid, cb) {
    var connection = pomelo.app.get('dbclient');
    var data = {}, sql, args;
    async.series([
        function (callback) {
            sql = 'select * from user_info where id = ?';
            args = [uid];
            connection.queryOne(sql, args, function (err, res) {
                if (!!res) {
                    data.userinfo = res;
                }
                callback(err);
            });
        },
        function (callback) {
            workDao.getWorkList(uid, function (err, works) {
                if (!!err) logger.error('Get heros for workDao failed! ' + err.stack);
                data.works = works;
                callback(err);
            });
        },
        function (callback) {
            systemDao.getImageList(uid, function (err, items) {
                if (!!err) logger.error('Get items for systemDao failed! ' + err.stack);
                data.images = items;
                callback(err);
            });
        },
        function (callback) {
            systemDao.getMusicList(uid, function (err, items) {
                if (!!err) logger.error('Get items for musicDao failed! ' + err.stack);
                data.musics = items;
                callback(err);
            });
        },
        function (callback) {
            systemDao.getDocumentList(uid, function (err, items) {
                if (!!err) logger.error('Get items for documentDao failed! ' + err.stack);
                data.documents = items;
                callback(err);
            });
        }
    ], function (err, results) {
        utils.invokeCallback(cb, err, data);
    });
};

userDao.saveToken = function (uid, token, cb) {
    var sql = 'update user_info set token = ? where id = ?';
    var args = [token, uid];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err) {
            utils.invokeCallback(cb, err, null);
        } else {
            utils.invokeCallback(cb, err, token);
        }
    });
};

userDao.createUser = function (uid, cell, cb) {
    var time = Math.floor(new Date().getTime() / 1000);
    var connection = pomelo.app.get('dbclient');
    var originalData = { "name": "my_first_project", "code": "// Let us code the future \nvar canvas=document.getElementById('canvas');\ncanvas.width=375;\ncanvas.height=500;\nvar ctx = canvas.getContext('2d');\n\n", "storyID": 0 };
    var data = {}, sql, args;
    async.series([
        function (callback) {
            workDao.createWork(uid, originalData.name, originalData.code, function (err, work) {
                data.works = [work];
                callback(err);
            });
        },
        function (callback) {
            sql = 'insert into user_info (id, nickName, cell, createTime) values(?,?,?,?)';
            args = [uid, configUtil.getNickName(), cell, time];
            connection.query(sql, args, function (err, res) {
                callback(err);
            });
        },
        function (callback) {
            sql = 'select * from user_info where id = ?';
            args = [uid];
            connection.queryOne(sql, args, function (err, res) {
                if (!!res) {
                    data.userinfo = res;
                }
                callback(err);
            });
        },
        function (callback) {
            systemDao.getImageList(uid, function (err, items) {
                if (!!err) logger.error('Get items for systemDao failed! ' + err.stack);
                data.images = items;
                callback(err);
            });
        },
        function (callback) {
            systemDao.getMusicList(uid, function (err, items) {
                if (!!err) logger.error('Get items for systemDao failed! ' + err.stack);
                data.musics = items;
                callback(err);
            });
        },
        function (callback) {
            systemDao.getDocumentList(uid, function (err, items) {
                if (!!err) logger.error('Get items for systemDao failed! ' + err.stack);
                data.documents = items;
                callback(err);
            });
        }
    ], function (err, results) {
        utils.invokeCallback(cb, err, data);
    });
}

userDao.getRoomInfo = function (uid, cb) {
    var time = Math.floor(new Date().getTime() / 1000);
    var connection = pomelo.app.get('dbclient');
    var roomlist, sql, args;
    async.series([
        function (callback) {
            sql = 'select * from game_classroom_user where uid = ? and startTime > ? order by startTime asc';
            args = [uid, time];
            console.info("uid&time: " + uid + "," + time);
            connection.query(sql, args, function (err, res) {
                console.info("roomlist_getroominfo: " + res);
                if (!!res) roomlist = res;
                callback(err);
            });
        }
    ], function (err, results) {
        if (roomlist.length > 0) utils.invokeCallback(cb, err, roomlist[0]['roomname']);
        else utils.invokeCallback(cb, err, "");
    });
}

userDao.setTeacher = function (uid, cb) {
    var sql = 'update user_info set vip = ? where id = ?';
    var args = [10, uid];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err) {
            utils.invokeCallback(cb, err, null);
        } else {
            utils.invokeCallback(cb, err, uid);
        }
    });
}

userDao.setNickname = function (uid, name, cb) {
    var sql = 'update user_info set nickName = ? where id = ?';
    var args = [name, uid];
    pomelo.app.get('dbclient').query(sql, args, function (err, res) {
        if (err) {
            utils.invokeCallback(cb, err, null);
        } else {
            utils.invokeCallback(cb, err, uid);
        }
    });
}
