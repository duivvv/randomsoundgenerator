var express = require('express');
var app = express();
var server = require('http').Server(app);

/** CONFIG **/
require("./config/middleware.js")(app, express);

var port = process.env.PORT;

server.listen(port, function() {
	console.log('Server listening at port', port, 'in', process.env.NODE_ENV, 'mode');
});
