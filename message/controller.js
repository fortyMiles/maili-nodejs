/*
 * Controller of message.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2016-14-Jan
 *
 */

var request = require('request');

var get_message_by_unique_code = function(req, res){
	var ip = 'localhost';
	var route = '/message/' + req.params.unique_code;
	var port = '3001';

	var url = 'http://' + ip + ':' + port + route;

	request(url, function(error, response, body){
		if(error) throw error;
		if(response.statusCode == 200){
			res.status(response.statusCode);
			res.json(JSON.parse(body));
		}else{
			res.status(response.statusCode);
		}
	});
};

var get_history_p2p_message = function(){};
var get_history_p2g_message = function(){};
var get_history_feed_message = function(){};
var get_unread_feed_message = function(){};

module.exports = {
	get_history_p2p_message: get_history_p2p_message,
	get_history_p2g_message: get_history_p2g_message,
	get_history_feed_message: get_history_feed_message,
	get_unread_feed_message: get_unread_feed_message,
	get_message_by_unique_code: get_message_by_unique_code,
};

