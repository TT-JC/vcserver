var dispatcher = require('../../../util/dispatcher');
var accountDao = require('../../../dao/accountDao');
var async = require('async');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
Handler.prototype.queryEntry = function (msg, session, next) {
    var self = this;
    var uid, host, port;
    async.waterfall([
        function (cb) {
            accountDao.getAccountInfo(msg.name, function (err, player) {
                cb(err, player);
            });
        },
        function (player, cb) {
            if (!player) {
                accountDao.createAccount(msg.name, function (err, player) {
                    cb(err, player.id);
                });
            } else cb(err, player.id)
        },
        function (id, cb) {
            uid = id;
            var connectors = self.app.getServersByType('connector');
            // console.log("connectors:" + connectors);
            // console.log("connectorslen:" + connectors.length);
            if (!connectors || connectors.length === 0) {
                next(null, {
                    code: 500
                });
                return;
            }
            // select connector
            console.info(connectors);
            var count = connectors.length;
            console.info("count=", count);
            var res = dispatcher.dispatch(uid, connectors);
            host = res.host;
            port = res.clientPort;
            cb(err);
        }], function (err) {
            if (err) {
                next(err, { code: 501 });
                return;
            }
            next(null, { code: 200, uid: uid, host: host, port: port });
        }
    );
};
