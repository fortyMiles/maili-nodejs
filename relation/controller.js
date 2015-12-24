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
var _ = require('ramda');

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


	converse_relation = relation_value.get_converse_relation(inviter.is_male(), relation);

	relation_handler.create_new_relation({
		user1: inviter.phone,
		user2: invitee.phone,
		relation: relation,
		scope: scope,
	});

	if(scope == HOME){
		var home = req.locals.home;
		var position = req.body.invitee_position;

		var connect_home_member_with_new_user = _.curry(_connect_two_person)(invitee)(position);

		home.member
		.filter(function(member){return member.username != invitee.phone;})
		.map(connect_home_member_with_new_user);

		_update_home_info(home, position, invitee.phone);

		if(invitee.find_self_home(position)){
			invitee.change_default_home(home.home_id, home.owner);
		}else{
			invitee.add_a_home(home.home_id, home.owner, converse_relation);
		}
		invitee.save();

	}else{
		inviter.add_contractor(invitee.phone, relation, relation);
		invitee.add_contractor(inviter.phone, converse_relation, inviter.nickname);
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
 * Connect Two Person.
 * 
 * @param {Model} new_user relation_starter is new user;
 * @param {Int} new_user_position relation receiver is previous home member.
 * @param {Json} home_member is find from home member list, it's a json.
 */

var _connect_two_person = function(new_user, new_user_position, home_member){
	var home_member_position = Number(home_member.position);

	user_handler.get_user_by_phone(home_member.username, function(previous_member){

		var relation_member_call_user = relation_value.get_title(home_member_position, new_user_position, new_user.is_male());

		previous_member.add_contractor(new_user.phone, relation_member_call_user, new_user.nickname);
		// home member add new user to his contract.
		console.log(previous_member.phone + ' add ' + relation_member_call_user + ' : ' + new_user.phone);

		var relation_user_call_member = relation_value.get_title(new_user_position, home_member_position, previous_member.is_male());
		new_user.add_contractor(previous_member.phone, relation_user_call_member, previous_member.nickname);
		console.log(new_user.phone + ' add ' + relation_user_call_member + ' :' + previous_member.phone);

		new_user.save();
		previous_member.save();

	});
};

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
