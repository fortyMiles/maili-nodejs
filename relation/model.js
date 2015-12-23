/*
 * Relation Models.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relation_value = require('./data/relation_value.js');

var HomeSchema = new Schema({
	home_id: String,
	creator: String,
	create_time: {type: Date, default: Date.now},
	member:[{
		username: String,
		position: int,
		//location: [],
	}],
	name: {type: String, default: null},
	slogen: {type: String, default: null},
});

/*
 * Every member add a person to self contract.
 *
 * @param {Model} User model
 * @param target_id
 *
 */

/*
 * Static methods of Home Schema. 
 *
 * Add a memeber to a home.
 *
 * @param {String} home_id
 * @param {String} user_phone_number
 */

HomeSchema.statics.add_person_to_a_home = function(home_id, user_phone, position, callback){
	this.findOne({home_id: home_id}, function(err, home){
		if(err) throw err;
		if(home){
			home.add_member(user_phone, Number(position));
			home.save();
		}
		callback(home);
	});
};
/*
 * Add a member to self member list.
 *
 * @param {String} the user's object id;
 *
 */
HomeSchema.methods.add_member = function(user_phone, position){
	this.member.push({
		username: user_phone,
		position: Number(position),
	});
};

var Home = mongoose.model('Home', HomeSchema);

var RelationSchema = new Schema({
	user1: String, 
	user2: String, 
	relation: String,
	scope: {type: String, enum: ['H', 'F', 'R']},
	nickname: {type: String, default: null},
	create_time: {type: Date, default: Date.now},
});

/*
 * Create a converse relation.
 *
 * @param {Model} User1 Model
 * @param {Model} User2 Model
 * @param {String} type of relation
 * @param {String} relation of user1 -> user2, if user1 if boy, user2 is his mother, relation will be mother.
 *
 * @api public
 *
 */

RelationSchema.statics.create_converse_relation = function(user1_id, user2_id, relation, scope, user1_is_male, callback){
	var converse_relation = relation_value.get_converse_relation(user1_is_male, relation);

	var new_relation = new this({
		user1: user2_id,
		user2: user1_id,
		relation: converse_relation,
		scope: scope,
	});
	new_relation.save(function(err){
		if(err) throw err;
		if(callback) callback(converse_relation);
	});
};

var Relation = mongoose.model('Relation', RelationSchema);

module.exports = {
	Home: Home,
	Relation: Relation,
};
