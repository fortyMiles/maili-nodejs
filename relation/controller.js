/*
 * Controller of Relation.
 * 
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var user_handler = require('../account/handler.js');
var relation_handler = require('./handler.js');

/*
 * Change user's id to user object and change home's id to home object.
 *
 *
 */
var change_id_to_object = function(req, res, next){
	var data = req.body;

	user_handler.get_user_by_phone(data.user1, function(user){
		req.locals.user1 = user;
	});

	user_handler.get_user_by_phone(data.user1, function(user){
		req.locals.user2 = user;
	});

	relation_handler.get_home_by_id(data.home_id, function(home){
		req.locals.home = home;
	});

	next();
};

var create_relation = function(req, res, next){
};

var _add_new_relation = function(res, data){
	handler.create_new_relation(data);
	res.status(201);
	res.json({created: true});
};

var get_contract = function(req, res, next){};
var get_home_member = function(req, res, next){};
var get_home_id = function(req, res, next){};
var get_relation_id = function(req, res, next){};
var get_friend_id = function(req, res, next){};
var get_home_creator = function(req, res, next){};
var get_realtion_info = function(req, res, next){};

module.exports = {
	create_relation: create_relation,
	get_contract: get_contract,
	get_home_member: get_home_member,
	get_home_id: get_home_id,
	get_relation_id: get_relation_id,
	get_friend_id: get_friend_id,
	get_home_creator: get_home_creator,
	get_realtion_info: get_realtion_info,
};
