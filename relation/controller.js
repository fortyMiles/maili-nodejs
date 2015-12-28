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
var create_relation = function(req, res, next){

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

		for(var i = 0; i < home.member.length; i++){
			if(home.member[i].username == invitee.phone){
				continue;
			}else{
				connect_home_member_with_new_user(home.member[i]);
			}
		}

		if(invitee.find_self_home(position)){
			invitee.change_default_home(home.home_id, home.owner);
		}else{
			invitee.add_a_home(home.home_id, home.owner, converse_relation);
		}
		invitee.save();

		next();
	}else{
		inviter.add_contractor(invitee.phone, relation, relation);
		invitee.add_contractor(inviter.phone, converse_relation, inviter.nickname);
	}

	res.status(200);
	res.json({created: 'success'});
};

/*
 * Updarte home
 */

var add_invitee_to_home = function(req, res, next){
	var home = req.locals.home;
	var position = req.body.invitee_position;
	var invitee = req.locals.invitee;

	_update_home_info(home, position, invitee.phone);
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
 * "Home Member add a new contractor: new_user"
 * 
 * @param {Model} new_user relation_starter is new user;
 * @param {Int} new_user_position relation receiver is previous home member.
 * @param {Json} home_member is find from home member list, it's a json.
 * @param {Function} notification for create new relation.
 */

var _connect_two_person = function(new_user, new_user_position, exist_member, notification){

	var home_member_position = Number(exist_member.position);

	user_handler.get_user_by_phone(exist_member.username, function(previous_member){
		var relation_member_call_user = relation_value.get_title(home_member_position, new_user_position, new_user.is_male());

		previous_member.add_contractor(new_user.phone, relation_member_call_user, new_user.nickname);
		// home member add new user to his contract.
		console.log(previous_member.phone + ' add ' + relation_member_call_user + ' : ' + new_user.phone);

		var relation_user_call_member = relation_value.get_title(new_user_position, home_member_position, previous_member.is_male());
		new_user.add_contractor(previous_member.phone, relation_user_call_member, previous_member.nickname);
		console.log(new_user.phone + ' add ' + relation_user_call_member + ' :' + previous_member.phone);

		new_user.save().then(function(){
			notification(new_user.phone, relation_user_call_member, previous_member.phone);
		});

		previous_member.save(function(){
			notification(previous_member.phone, relation_member_call_user, new_user.phone);
		});
	});
};

/*
 * Notification to Socket io that creat a new relation.
 *
 */


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
