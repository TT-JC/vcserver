var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
var sync = require('pomelo-sync-plugin');
var configUtil = require('./app/util/configUtil');
var path = require('path');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'vcserver');

// app configure
app.configure('production|development', function() {
	configUtil.loadNickName();
	app.loadConfig('mysql',app.getBase() + '/config/mysql.json');
	// route configures
	app.route('game', routeUtil.game);
	app.route('chat', routeUtil.chat);
	// filter configures
	app.filter(pomelo.filters.timeout());
});

// Configure database
app.configure('production|development', 'gate|game|chat|connector|master', function() {

  var dbclient = require('./app/dao/mysql/mysql').init(app);
  app.set('dbclient', dbclient);

  app.use(sync, {sync: {path:__dirname + '/app/dao/mapping', dbclient: dbclient}});
});

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      disconnectOnTimeout: false,
      heartbeat : 300000,
      useDict : true,
      useProtobuf : true
    });
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});


// start app
app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});