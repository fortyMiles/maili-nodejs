/*
 * Controller of Relation.
 * 
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var user_handler = require('../account/handler.js');
var relation_handler = require('./handler.js');
var relation_value = require('./data/relation_value.js');

/*
 * Based on user and relation, create relation.
 *
 * @api public
 */
var create_relation = function(req, res, next){

	var HOME = 'H';

	var data = req.body;
	var nickname = data.nickname || null;
	
	var user_not_exist = false;

	user_handler.get_user_by_phone(data.user1, function(user){
		if(user){
			user.add_contractor(data.user2, data.relation, nickname);
		}else{
			user_not_exist = true;
		}

	});


	var converse_relation = relation_value.get_converse_relation(data.user1_is_male, data.relation);

	user_handler.get_user_by_phone(data.user2, function(user){
		if(user){
			user.add_contractor(data.user1, converse_relation, data.user1_name);
		}else{
			user_not_exist = true;
		}
	});

	relation_handler.create_new_relation(data);

	// create converse relation.
	relation_handler.create_new_relation({
		user1: data.user2,
		user2: data.user1,
		relation: converse_relation,
		scope: data.scope,
	});

	if(user_not_exist){
		res.status(404);
		res.json({user_not_exist: 'user1 or user2 is not exist'});
	}else if(data.scope != HOME){
		res.status(200);
		res.json({created: 'success'});
	}else{
		relation_handler.add_person_to_a_home(data.home_id, data.user2, function(home){});
		user_handler.add_home_to_a_person(data.user2, data.home_id, data.user1, converse_relation, function(user){});
		res.status(200);
		res.json({created: 'success'});
		next(); // next() to update_home_member_contract()
	}
};

/*
 * Update family member contract.
 *
 */

var add_person_to_home = function(user1, user2, home_id){
	//relation_handler.every_member_add_person_to_contract(home_id, req.body.user2);
};

var _add_new_relation = function(res, data){
	handler.create_new_relation(data);
	res.status(201);
	res.json({created: true});
};

var get_contract = function(req, res, next){};
var get_home_member = function(req, res, next){};
var get_home_id = function(req, res, next){

};
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
