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
var account_router = require('./account/router.js');
var relation_router = require('./relation/router.js');
var message_router = require('./message/router.js');

app.use(body_parse.urlencoded({ extended: false }));
app.use(body_parse.json());

app.use('/home/', relation_router);
app.use('/account/',  account_router);
app.use('/relation/', relation_router);
app.use('/feed/', account_router);
app.use('/message/', message_router);

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listring on http://%s:%s', host, port);
});

module.exports = {
	app: app,
};
