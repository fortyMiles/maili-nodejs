/*
 * Data handler.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2016-17-Dec
 *
 */

var db_connection = require('../configuration/db.js');

var UserModel = require('./model.js').User;

var assert = require('assert');

/*
 * Gets a user object by phone number.
 *
 * @param {String} phonenumber of user.
 * @param {Function} callback of user object.
 */
var get_user_by_phone = function(user_phone, callback){
	UserModel.findOne({phone: user_phone}, function(err, user){
		if(err) throw err;
		callback(user);
	});
};


/*
 * Get user joined home.
 *
 * @param {String} user's phone number
 *
 * @callback function of user's home list.
 *
 */

var get_user_joined_home = function(user_phone, callback){
	UserModel.findOne({phone: user_phone}, function(err, user){
		if(err) throw err;
		callback(user.home);
	});
};

var check_user_exist = function(user_phone, callback){
	var restirction = {
		phone: user_phone,
	};

	UserModel.count(restirction, function(err, count){
		if(err) throw err;
		callback(count);
	});
};

var create_new_user = function(data, callback){
	var user = new UserModel(data);
	user.register_data = new Date();
	user.is_login = true;

	user.initiate();
	user.generate_session_code();

	user.save(function(err, user){
		if(callback) callback(user);
	});
};


var update_user = function(data, callback){
	var phone = data.phone;

	userModel.findOne({phone: phone}, function(err, user){
	// update self inforamtion.
	// update home information.
	});
};

var login = function(username, password, callback){
	UserModel.findOne({phone: username, password: password},function(err, user){
		if(user){
			user.login();
			user.generate_session_code();
			user.save();
			callback(user.current_session_token);
		}
	});
};

var get_user_information = function(username, callback){
	UserModel.findOne({phone: username}, '-_id first_name avatar nickname marital_status gender', function(err, user){
		if(err) throw err;
		callback(user);
	});
};

/*
 * Add a home to a user's home list.
 *
 * @param {String} username
 * @param {String} home_id
 * @param {String} home_owner
 * @param {String} relation
 *
 */
var add_home_to_a_person = function(username, home_id, home_owner, relation, callback){
	UserModel.add_home_to_a_person(username, home_id, home_owner, relation, callback);
};

module.exports = {
	create_new_user: create_new_user,
	check_user_exist: check_user_exist,
	update_user: update_user,
	login: login,
	get_user_information: get_user_information,
	get_user_by_phone: get_user_by_phone,
	get_user_joined_home: get_user_joined_home,
	add_home_to_a_person: add_home_to_a_person,
};
