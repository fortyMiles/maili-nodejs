/*
 * Define the user model.
 *
 * @Author Minchiuan Gao <minchuian.gao@gmail.com>
 * @Date 2016-17-Dec
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_user_id: Schema.ObjectId,
	first_name: String, 
	password: String,
	phone: String,
	gender: {type: String, enum: ['F', 'M', 'U'], default: 'U'},
	marital_status: Boolean,
	nickname: String,
	is_login: Boolean,
	tagline: String, // Self description.
	avatar: String, // Avatar url,
	last_login_date: Date,
	register_date: {type: Date, default: Date.now},

	contracts:[{ // a person's all contracts.
		user_id:Schema.ObjectId,
		nickname: String,
		relation: String,
	}],

	feed_group:[{ // a person's feeds scope.
		group_id: Schema.ObjectId,
		group_nick_name: String, // Every one will have three initial feed groups, home, relation, all friends.
	}],

	home:[{ // a person joined home.
		home_id: Schema.ObjectId,
		home_nickname: String,
		home_owner: String,
		home_relation: String, // Relation with self and home owner.
	}],
});

UserSchema.methods.login = function(){
	this.is_login = true;
	this.last_login_date = new Date();
};

UserSchema.methods.logout = function(){
	this.is_login = false;
};

UserSchema.methods.add_feed_group = function(feed_name){
	var feed = {group_id: mongoose.Types.ObjectId(), group_nick_name: feed_name};
	this.feed_group.push(feed);
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User: User
};
