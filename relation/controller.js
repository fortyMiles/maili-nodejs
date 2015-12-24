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
var create_relation = function(req, res){

	var HOME = 'H';

	var inviter = req.locals.inviter;
	var invitee = req.locals.invitee;
	var relation = req.body.relation;
	var scope = req.body.scope;

	inviter.add_contractor(invitee.phone, relation, relation);

	converse_relation = relation_value.get_converse_relation(inviter.is_male(), relation);

	invitee.add_contractor(inviter.phone, converse_relation, inviter.nickname);

	relation_handler.create_new_relation({
		user1: inviter.phone,
		user2: invitee.phone,
		relation: relation,
		scope: scope,
	});

	if(scope == HOME){
		var home = req.locals.home;
		var position = req.body.invitee_position;
		_update_home_info(home, position, invitee.phone);

		if(invitee.find_self_home(position)){
			invitee.change_default_home(home.home_id, home.owner);
		}else{
			invitee.add_a_home(home.home_id, home.owner, converse_relation);
		}

		invitee.save();
	}

	res.status(200);
	res.json({created: 'success'});
};

/*
 * Update Home info
 *
 * @param {Model} home
 * @param {Number} new person position.
 * @param {String} user_phone_number
 * @api private
 */

var _update_home_info = function(home, position, user_phone_number){
	home.add_member(user_phone_number, position);
	home.update_home_owner();
	home.save();
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
