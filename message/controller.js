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

var _get_url = function(ip, port, route){
	return util.format('http://%s:%s%s', ip, port, route);
};

var _direct_to_url = function(url, res){
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

var get_message_by_unique_code = function(_get_url, _direct_to_url, ip, port, req, res){
	var route = '/message/' + req.params.unique_code;
	var url = _get_url(ip, port, route);
    _direct_to_url(url, res);
};

var get_history_p2p_message = function(_get_url, _direct_to_url, ip, port, req, res){
	var last_unique_code = req.params.last_unique_code;
	var receiver_id = req.params.receiver_id;
	var sender_id = req.params.sender_id;
	var step = req.params.step;

	var route = util.format('/message/p2p/history/%s/%s/%s/%s', last_unique_code, receiver_id, sender_id, step);
	var url = _get_url(ip, port, route);

	_direct_to_url(url, res);
};

var get_history_p2g_message = function(_get_url, _direct_to_url, ip, port, req, res){
	var last_unique_code = req.params.last_unique_code;
	var group_id = req.params.group_id;
	var step = req.params.step;

	var route = util.format('/message/p2g/history/%s/%s/%s', last_unique_code, group_id, step);
	var url = _get_url(ip, port, route);

	_direct_to_url(url, res);
};


var IP = 'localhost';
var PORT = '3001';

var get_message_by_unique_code_from_local_host = _.curry(get_message_by_unique_code)(_get_url, _direct_to_url, IP, PORT);
var get_history_p2p_message_from_local_host = _.curry(get_history_p2p_message)(_get_url, _direct_to_url, IP, PORT);
var get_history_p2g_message_from_local_host = _.curry(get_history_p2g_message)(_get_url, _direct_to_url, IP, PORT);

var get_history_feed_message = function(){};
var get_unread_feed_message = function(){};

module.exports = {
	get_history_p2p_message: get_history_p2p_message_from_local_host,
	get_history_p2g_message: get_history_p2g_message_from_local_host,
	get_history_feed_message: get_history_feed_message,
	get_unread_feed_message: get_unread_feed_message,
	get_message_by_unique_code: get_message_by_unique_code_from_local_host,
};

