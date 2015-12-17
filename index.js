/*
 * Main Module of Maili Server.
 * 
 * @Author Minchuian Gao <minchiuan@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var express = require('express');
var body_parse = require('body-parser');
var app = express();
var account_router = require('./account/router');

app.use(body_parse.urlencoded());
app.use(body_parse.json());

app.use('/account/', account_router);


var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listring on http://%s:%s', host, port);
});
