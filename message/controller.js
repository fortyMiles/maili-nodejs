/*
 * Controller of message.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2016-14-Jan
 *
 */

var request = require('request');
var _ = require('ramda');
var util = require('util');

var redirect_to_socket = function(req, res){

	var IP = 'localhost';
	var PORT = '3001';
	var url = util.format('http://%s:%s%s', IP, PORT, req.originalUrl);

	request(url, function(error, response, body){
		if(error) throw error;
		res.status(response.statusCode);
		if(response.statusCode == 200){
			res.json(JSON.parse(body));
		}else{
			res.json({err: 'no this message'});
		}
	});
};

module.exports = {
	redirect_to_socket: redirect_to_socket,
};

