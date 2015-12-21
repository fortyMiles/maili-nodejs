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
 */

var create_home = function(home_id, creator, callback){
	var home = new Home({
		home_id: home_id,
		creator: creator,
	});

	home.save(function(err, home){
		if(err) throw err;
		callback(home);
	});
};

var create_new_relation = function(data, callback){
	var relation = new Relation(data);
	relation.save();

	create_converse_relation(data);
};

var check_relation_exist = function(user1, user2, callback){
	Relation.count({user1: user1, user2: user2}, function(err, count){
		if(err) throw err;
		callback(count);
	});
};

var create_converse_relation = function(data){
	var new_user1 = data.user2;
	var new_user2 = data.user1;
	var old_relation = data.relation;
	var old_scope = data.scope;

	Q.promise(function(resolve, reject){
		User.findOne({phone: new_user2}, function(err, user) {
			if(err) throw err;
			if(user.gender == 'F'){
			}else{
			}
			resolve(relation);
		});
	}).then(function(relation){
		console.log(relation);
	}).done();
	/*
	   var new_relation = Q.fcall(function(){
	   var relation = 'new';
	   var user_gender =  User.findOne({phone: new_user2}, function(err, user){
	   if(err) throw err;
	   if(user.gender == 'F'){
	   relation = relation_value[old_relation].cft;
	   return relation;
	   }else{
	   relation = relation_value[old_relation].cmt;
	   return relation;
	   }
	   });
	   }).then(function(relation){
	   console.log(relation);
	   }).done();
	   */

	var new_scope = old_scope;
	//var new_scope = _get_converse_scope(new_user1, new_user2, data, old_relation);

	/*
	   var converse_relation = new Relation({
user1: new_user1,
user2: new_user2,
relation: new_relation,
scope: new_scope,
});

converse_relation.save();
*/
};

var _get_converse_relation = function(new_user1, new_user2, old_relation){
};

/*
   var _new_scope = function(old_relation){
   var HOME = 'H';
   var FRIEND = 'F';
   var RELATION = 'R';

   var new_scope = null;

   if((old_relation == FRIEND) || (old_relation == RELATION)){
   new_scope = old_relation;	
   }else{

   }
   };
   */

module.exports = {
	relation_accept: relation_accept,
	check_relation_exist: check_relation_exist,
	create_new_relation: create_new_relation,
	create_home: create_home,
	get_home_by_id: get_home_by_id,
};
