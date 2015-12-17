/*
 * Controller of Relation.
 * 
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var handler = require('./handler.js');

var create_relation = function(req, res, next){
	var data = req.body;
	var relation = data.relation;

	if(!handler.relation_accept(relation)){
		res.status(406);
		res.json({relation: 'relation unaccept'});
	}

	handler.check_relation_exist(data.user1, data.user2, function(count){
		if(count !== 0){
			res.status(409);
			res.json({relation: 'relaton existed'});
		}else{
			_add_new_relation(res, data);
		}
	});
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
