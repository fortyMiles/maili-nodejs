/*
 * Define the user model.
 *
 * @Author Minchiuan Gao <minchuian.gao@gmail.com>
 * @Date 2016-17-Dec
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('ramda');

var UserSchema = new Schema({
	user_id: String, // user unique code.
	first_name: String, 
	password: String,
	phone: String,
	gender: {type: String, enum: ['F', 'M', 'U'], default: 'U'},
	marital_status: {type: Boolean, default: null},
	nickname: {type: String, default: null},
	is_login: {type: Boolean, default: false},
	tagline: String, // Self description.
	avatar: {type: String, default: null}, // Avatar url,
	last_login_date: Date,
	register_date: {type: Date, default: Date.now},
	default_home: String, //everyone has a initial home.
	current_session_token: String, // current session token. Every time login or register, will give a token back to him.

	contract:[{ // a person's all contracts.
		user_id:String,
		nickname: {type: String, default: null},
		relation: {type: String, default: 'F'},
	}],

	feed_group:[{ // a person's feeds scope.
		group_id: String,
		group_nickname: String, // Every one will have three initial feed groups, home, relation, all friends.
	}],

	home:[{ // a person joined home.
		home_id: String,
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

/*
 * Add a new person to self's contract list.
 *
 * @param {String} target's user id.
 *
 */

UserSchema.methods.add_contractor = function(user_id, relation, nickname){
	relation = relation || 'F';
	nickname = nickname || null;
   this.contract.push({
	   user_id: user_id,
	   nickname: nickname,
	   relation: relation,
   });
};

/*
 * Creat a unique id base on the name and feed's name.
 *
 * @param {String} this person's name
 * @param {String} which group created for.
 *
 */

var create_id_by_name_and_time = function(name, group_name){
	var time_length = 6;
	var time_token = Date.now().toString().slice(-1 * time_length);
	var last_code = group_name.charCodeAt(0);
	var id = name + time_token + last_code;
	return id;
};

/*
 * Initial feeds. Every one will have two feeds, which is relation and global.
 *
 * Corrsponding to differen sight with feeds.
 *
 * @param {Function} how to create id by phone and feeds name.
 *
 */

UserSchema.methods.initial_feed_group = function(){
	var FEED_GROUP = ['relation', 'global'];

	FEED_GROUP.map(function(e){
	    var id = create_id_by_name_and_time(this.phone, e);
		this.feed_group.push({
			group_id: id,
			group_nickname:e,
		});
	}, this);
};

/*
 * Create a user's default home.
 *
 */

UserSchema.methods.initial_self_home = function(){
	var home_id = create_id_by_name_and_time(this.phone, 'home');
	this.default_home = home_id;
};

/*
 * Initiate user's self unique code
 *
 */

UserSchema.methods.initiate_self_code = function(){
	var user_id = create_id_by_name_and_time(this.phone, 'SELF');
	this.user_id = user_id;
};
/*
 * Push a home in his home list.
 *
 * @param {String} home_id
 * @param {String} home_owner
 */

UserSchema.methods.add_a_home = function(home_id, home_owner, relation){
	relation = relation || 'self';

	this.home.push({
		home_id: home_id,
		home_nickname: null,
		home_owner: home_owner,
		home_relation: relation,
	});
};

/*
 * Generate current session token.
 *
 * @param {String} phone number
 *
 */

var _generate_random_int = function(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

UserSchema.methods.generate_session_code = function(){
	var number = Number(this.phone);
	var length_min = 2, length_max = 5;
	var length = _generate_random_int(length_min, length_max);
	var min = Math.pow(10, length - 1);  
	// if length = 2, mean random number length is 2
	var max = Math.pow(10, length) - 1; 
	// so, the possible max is 99, which is 10^2 -1, min is 10, which is 10^(2-1)
	var random_number = _generate_random_int(min, max);
	number *= random_number;
	var session_token = number.toString() + random_number.toString() + length.toString();
	this.current_session_token = session_token;
};

/*
 * Initial information when a user been created.
 *
 */

UserSchema.methods.initiate = function(){
	this.initial_feed_group();
	this.initial_self_home();
	this.initiate_self_code();
	this.add_a_home(this.default_home, this.phone);
};

/*
 * Create a new 'table'.
 *
 */

var User = mongoose.model('User', UserSchema);

module.exports = {
	User: User,
	create_id_by_name_and_time: create_id_by_name_and_time,
};
