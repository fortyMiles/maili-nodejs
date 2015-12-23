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
var assert = require('assert');

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
	default_home_position: {type: Number, default: 4},

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

UserSchema.methods.is_single = function(){
	return this.marital_status === false;	
};

UserSchema.methods.marital_status_unknow = function(){
	return this.marital_status === null || this.marital_status === undefined;
};

UserSchema.methods.gender_unknow = function(){
	return this.gender == 'U';
};

UserSchema.methods.is_male = function(){
	return this.gender == 'M';
};

UserSchema.methods.login = function(){
	this.is_login = true;
	this.last_login_date = new Date();
};

UserSchema.methods.logout = function(){
	this.is_login = false;
};

/*
 * Need a home
 *
 */

UserSchema.methods.need_home = function(){
	return !(this.default_home === null || this.default_home === undefined);
};

/*
 * Update user.
 *
 * @param {Json} new data
 * @callback test if need create new home.
 *
 */

UserSchema.statics.update_user = function(new_data, need_create_home, callback){
	var restriction = {phone: new_data.phone};

	this.update(restriction, new_data, function(err, numberAffected){
		if(err) throw err;
		if(need_create_home){
			User.findOne(restriction, function(err, user){
				user.create_new_home();
				user.save();
				callback(user);
			});
		}
	});
};
/*
 * Judge if need create a new home.
 *
 * @param {Json} current_data
 *
 * @return {Boolean} if need create a new home for him
 * @api private
 *
 */

UserSchema.methods.need_create_home= function(current_data){

	var need = false;

	if(this.marital_status_unknow() && 'marital_status' in current_data ){
		need = true;
	}

	if(this.gender_unknow() && 'gender' in current_data){
		need = true;
	}

	if(this.is_single() && 'marital_status' in current_data && current_data.marital_status.toString() === true.toString()){
		need = true;
	}

	return need;
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
 * Set user's home position.
 *
 */

UserSchema.methods.get_home_position = function(){
	var HOST = 4;
	var HOSTESS = 5;
	var CHILD = 6;

	// position = {maritial_status: {male: status}}
	var position = { 
		null:{ // marital_status == null
			false: HOSTESS, // is female
			true: HOST, // is male
		},

		true:{ // marital_status == true
			false: HOSTESS,
			true: HOST,
		},

		false:{
			false: CHILD,
			true: CHILD,
		},
	};

	return position[this.marital_status][this.is_male()];


};
/*
 * Create a user's default home.
 *
 */

UserSchema.methods.initial_self_home = function(){
	var home_id = create_id_by_name_and_time(this.phone, 'home');
	this.default_home = home_id;
	this.default_home_position = this.get_home_position();

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
 * Add a person in person's home list.
 *
 * @param {String} person_id
 * @param {String} home_id
 *
 * @api public
 *
 */

UserSchema.statics.add_home_to_a_person = function(person_id, home_id, home_owner, relation, callback){
	this.findOne({phone: person_id}, function(err, user){
		if(err) throw err;
		if(user){
			user.add_a_home(home_id, home_owner, relation);
			user.save();
		}
		callback(user);
	});
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
	this.initiate_self_code();

	if(!this.marital_status_unknow() && !this.gender_unknow()){
		this.create_new_home();
	}
};

/*
 * Create a new home for self.
 * When give user gender and married info or person change single to married, will create a home for a person.
 *
 */

UserSchema.methods.create_new_home = function(){
	this.initial_self_home();
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
