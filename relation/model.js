/*
 * Relation Models.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	group_id: String,
	creator: String,
	type: {type: String, enum: ['home', 'group', 'feed'], default: 'home'},
	create_time: {type: Date, default: Date.now},
	member:[{
		nickname: String,
		username: String,
	}],
	name: String,
	slogen: {type: String, default: null}
});

/*
 * Add a member to self member list.
 *
 * @param {String} the user's object id;
 *
 */
GroupSchema.methods.add_member = function(username, nickname){
	this.memeber.push({
		nickname: nickname,
		username: username,
	});
};

var Group = mongoose.model('Group',GroupSchema);

var RelationSchema = new Schema({
	user1: String, 
	user2: String, 
	relation: String,
	scope: {type: String, enum: ['H', 'F', 'R']},
	nickname: {type: String, default: null},
	create_time: {type: Date, default: Date.now},
});

var Relation = mongoose.model('Relation', RelationSchema);

module.exports = {
	Group: Group,
	Relation: Relation,
};
