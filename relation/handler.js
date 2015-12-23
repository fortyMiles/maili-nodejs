/*
 * Date Handler of Relation.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var db_connection = require('../configuration/db.js');

var Home = require('./model.js').Home;
var Relation = require('./model.js').Relation;
var Q = require('q');
var relation_dic = require('./data/relation_value.js');


/*
 * Tests if this relation is acceptable
 *
 * @param {String} relation
 *
 * @return {Boolean} if this relation is acceptable.
 *
 */

var relation_accept = relation_dic.relation_accept;


/*
 * Get home object by home id.
 *
 * @param {String} home_id
 *
 * @callback {Function} callback of getted home
 * @api public
 *
 */

var get_home_by_id = function(home_id, callback){
	Home.findOne({home_id: home_id}, function(err,  home){
		if(err) throw err;
		callback(home);
	});
};

/*
 * Create home 
 *
 * @param {String} home_id
 * @param {String} user_id
 *
 * @callback of saved home.
 *
 * @api public
 *
 */

var create_home = function(home_id, creator, callback){
	var home = new Home({
		home_id: home_id,
		creator: creator,
	});

	home.save(function(err, home){
		if(err) throw err;
		if(callback) callback(home);
	});
};

/*
 * Create a new relation.
 *
 * @param {json} data of relation info
 *
 * @api public
 *
 */
var create_new_relation = function(data, callback){
	var relation = new Relation(data);
	relation.save();
};

var check_relation_exist = function(user1, user2, callback){
	Relation.count({user1: user1, user2: user2}, function(err, count){
		if(err) throw err;
		callback(count);
	});
};

/*
 * Add a person to a home based on home id and person phone number.
 *
 * @param {String} home_id
 * @param {Array} user_ids list.
 *
 */

var add_person_to_a_home = function(home_id, user_name){
	Home.add_person_to_a_home(home_id, user_name, function(home){});
};

/*
 * Add a personn to a home.
 *
 */

/*
 * Check home existed
 *
 */

var check_home_exist = function(home_id, callback){
	Home.count({home_id: home_id}, function(err, count){
		if(err) throw err;
		callback(count);
	});
};

/*
 * Every member add person to contractor.
 *
 * @param {String} home_id
 * @param {String} user_id
 *
 */

var every_member_add_person_to_contract = function(home_id, target_user){
    Home.find({home_id: home_id}, function(err, home){
		if(err) throw err;
	});
};

module.exports = {
	relation_accept: relation_accept,
	check_relation_exist: check_relation_exist,
	create_new_relation: create_new_relation,
	create_home: create_home,
	get_home_by_id: get_home_by_id,
	add_person_to_a_home: add_person_to_a_home,
	check_home_exist: check_home_exist,
	
};
