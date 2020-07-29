var crc = require('crc');

module.exports.dispatch = function (uid, connectors) {
    console.info("connectors:" + connectors);
    var count = connectors.length;
    console.info("count=", count);
    console.info("uid:" + uid);
    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
};