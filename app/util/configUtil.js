var csv = require('node-csv').createParser();
var fs = require("fs");

var alldatas = {};
var fileVers = {};

module.exports.loadData = function(name) {
    fileVers[name] = (new Date(fs.statSync('config/data/'+name+".csv").mtime)).getTime();
    csv.parseFile('config/data/'+name+".csv", function(err, data) {
        alldatas[name] = {};
        var keys={};
        for (var i=0;i<data.length;i++){
            if(i==0){
                keys = data[i].toString().split(',');
            }else{
                var values = data[i].toString().split(',');
                var dat = {};
                for (var j=0;j<keys.length;j++){
                    dat[keys[j]] = values[j];
                }
                alldatas[name][dat[keys[1]]] = dat;
            }
        } 
    });
};

module.exports.getConfig = function(name,key) {
    if(fileVers[name]!=(new Date(fs.statSync('config/data/'+name+".csv").mtime)).getTime()) this.loadData(name);
    return alldatas[name][key];
};

module.exports.loadNickName = function() {
    fileVers["nickname"] = (new Date(fs.statSync('config/data/nick_name.csv').mtime)).getTime();
    csv.parseFile('config/data/nick_name.csv', function(err, data) {
        for (var i=0;i<data.length;i++){
            if(i==0){
                alldatas['nick'] = data[i].toString().split(',');
            }else{
                alldatas['name'] = data[i].toString().split(',');
            }
        }
    });
};

module.exports.getNickName = function() {
    if(fileVers["nickname"]!=(new Date(fs.statSync('config/data/nick_name.csv').mtime)).getTime()) this.loadNickName();
    return alldatas['nick'][Math.floor(Math.random()*alldatas['nick'].length)]+alldatas['name'][Math.floor(Math.random()*alldatas['name'].length)];
};
