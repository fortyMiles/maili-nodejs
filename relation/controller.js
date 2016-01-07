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
var notification = require('./notification.js').notification;
var _ = require('ramda');
var assert = require('assert');

/*
 * Cacualte inviter and invitee relationship.
 *
 * @param {Model} inviter
 * @param {Model} invitee
 * @param {Number} invitee_position
 * @param {Model} home, the inviter and invitee belong home.
 */

var caculate_inviter_and_invitee_relationship = function(inviter, invitee, invitee_position, home){
	var inviter_info = home.member.filter(function(member){
		return member.user_id == inviter.user_id;
	})[0];

	var inviter_call_invitee = relation_value.get_title(inviter_info.position, invitee_position, invitee.is_male());
	return inviter_call_invitee;
};

/*
 * Create new realtionship.
 */

var create_relation = function(req, res, next){
	var scope = req.body.scope;
    var HOME = 'H';
	var RELATION = 'R';

	var inviter = req.locals.inviter;
	var invitee = req.locals.invitee;

	var inviter_call_invitee = null; // relation inviter_call_invitee
	var invitee_call_inviter = null;

	if(scope == HOME){
		var home = req.locals.home;

		var invitee_position = req.body.invitee_position;


		// get relation bewteen inviter and invitee.
		inviter_call_invitee = caculate_inviter_and_invitee_relationship(inviter, invitee, invitee_position, home);
		invitee_call_inviter = relation_value.get_converse_relation(inviter.is_male(), inviter_call_invitee);

		// create this realtion in db.
		relation_handler.create_new_relation({
			user1: inviter.user_id,
			user2: invitee.user_id,
			relation: inviter_call_invitee,
			scope: scope,
		});

		// check if find one's self home.
		if(invitee.find_self_home(invitee_position)){
			invitee.change_default_home(home.home_id, home.owner);
		}else{
			invitee.add_a_home(home.home_id, home.owner, invitee_call_inviter);
		}
		invitee.save();

		// connect each person in group with invitee.
		_connect_home_member_and_invitee(home, invitee, invitee_position, function(relation_result_array){
			req.locals.result_array = relation_result_array;
			next();
		});
	}else if(scope == RELATION){
		inviter_call_invitee = req.body.relation;
		invitee_call_inviter = relation_value.get_converse_relation(inviter.is_male(), relation);
		inviter.add_contractor(invitee.user_id, inviter_call_invitee, invitee.nickname);
		invitee.add_contractor(inviter.user_id, invitee_call_inviter, inviter.nickname);
	}
};

/*
 * Connect home member and invitee.
 */

var _connect_home_member_and_invitee = function(home, invitee, invitee_position, callback){
	var _connect_home_member_with_new_user = _.curry(_connect_two_person)(invitee)(invitee_position);

	var result_array = [];
	_.map(function(user){
		_connect_home_member_with_new_user(user, function(relation){
			result_array.push(relation);
			if(result_array.length == home.member.length){
				callback(result_array);
			}
		});
	}, home.member);
};

	
/*
 *  Push result.
 *
 */

var _add_result = function(req, index, max_index, next, relation){
	req.locals.result_array.push(relation);
	if(index == max_index){
		next();
	}
};

/*
 * Updarte home
 */

var add_invitee_to_home = function(req, res, next){
	var home = req.locals.home;
	var position = req.body.invitee_position;
	var invitee = req.locals.invitee;

	home.add_member(invitee, position);
	home.update_home_owner();
	home.save();

	res.status(200);
	res.json({
		relation: req.locals.result_array,
		home_id: home.home_id
	});
};

/*
 * Connect Two Person.
 * "Home Member add a new contractor: new_user"
 * 
 * @param {Model} new_user relation_starter is new user;
 * @param {Int} new_user_position relation receiver is previous home member.
 * @param {Json} home_member is find from home member list, it's a json.
 * @param {Function} notification for create new relation.
 */

var _connect_two_person = function(new_user, new_user_position, exist_member, callback){
	var home_member_position = Number(exist_member.position);

	user_handler.get_user_by_id(exist_member.user_id, function(previous_member){
		debugger;
		var relation_member_call_user = relation_value.get_title(home_member_position, new_user_position, new_user.is_male());

		previous_member.add_contractor(new_user.user_id, relation_member_call_user, new_user.nickname);
		// home member add new user to his contract.

		var relation_user_call_member = relation_value.get_title(new_user_position, home_member_position, previous_member.is_male());
		new_user.add_contractor(previous_member.user_id, relation_user_call_member, previous_member.nickname);

		assert.equal(new_user.length === 0, false);
		new_user.save(function(){
			console.log(new_user.user_id + ' ' + previous_member.user_id + ' ' + relation_user_call_member);
		});

		previous_member.save(function(){
			//notification(previous_member.phone, new_user.phone, relation_member_call_user);
			console.log(previous_member.user_id + ' ' + new_user.user_id + ' ' + relation_member_call_user);
		});

		var relation = {
			receiver: {
				user_id: new_user.user_id,
				name: new_user.name,
				avatar: new_user.avatar,
				gender: new_user.gender,
				marital_status: new_user.marital_status,
				phone: new_user.phone,
			},

			friend: {
				user_id: previous_member.user_id,
				name: previous_member.name,
				avatar: previous_member.avatar,
				gender: previous_member.gender,
				marital_status: previous_member.marital_status,
				phone: previous_member.phone,
			},

			relation: relation_user_call_member,
			converse_relation: relation_member_call_user
		};

		callback(relation);
	});
};

/*
 * Notification to Socket io that creat a new relation.
 *
 * @param {String} Notification receiver;
 * @param {String} New friend
 * @param {String} Relation Name
 *
 */

var _notification = function(receiver, friend, relation){
	console.log(receiver + ' add '  + relation  + ' ' + friend);
};

var add_person_to_home = function(user1, user2, home_id){
	//relation_handler.every_member_add_person_to_contract(home_id, req.body.user2);
};

var get_contract = function(req, res, next){};
var get_home_member = function(req, res, next){};

var get_home_info = function(req, res, next){
	relation_handler.get_home_by_id(req.params.home_id, function(home){
		if(home){

			var postion_value = ['gf', 'gm', 'gfl', 'gml', 'father', 'mother', 'child'];

			res.status(200);
			res.json({data: home});
		}else{
			res.status(404);
			res.json({err: 'home not exist'});
		}
	});
};

var _change_home_num_to_str = function(home){
};

var get_relation_id = function(req, res, next){};
var get_friend_id = function(req, res, next){};
var get_home_creator = function(req, res, next){};
var get_realtion_info = function(req, res, next){};

module.exports = {
	create_relation: create_relation,
	get_contract: get_contract,
	get_home_member: get_home_member,
	get_relation_id: get_relation_id,
	get_friend_id: get_friend_id,
	get_home_creator: get_home_creator,
	get_realtion_info: get_realtion_info,
	add_invitee_to_home: add_invitee_to_home,
	get_home_info: get_home_info,
};
