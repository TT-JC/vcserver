var crc = require('crc');

module.exports.dispatch = function (uid, connectors) {
    console.info(connectors);
    var count = connectors.length;
    console.info("count=", count);
    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
};