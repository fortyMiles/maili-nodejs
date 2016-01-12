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
	UserModel.findOne({phone: user_phone},  function(err, user){
		if(err) throw err;
		callback(user);
	});
};

/*
 * Get user by id
 */

var get_user_by_id = function(user_id, callback){
	UserModel.findOne({user_id: user_id},  function(err, user){
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

var get_user_joined_home = function(user_id, callback){
	UserModel
	.findOne({user_id: user_id},'-home._id')
	.populate('home.home', '-_id home_id owner')
	.exec(function(err, user){
		if(err) throw err;
		callback(user.home);
	});
};

var check_user_exist = function(user_id, callback){
	var restirction = {
		user_id: user_id
	};

	UserModel.count(restirction, function(err, count){
		if(err) throw err;
		callback(count);
	});
};

var check_phone_register = function(user_phone, callback){
	var restirction = {
		phone: user_phone
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
	user._id = user.user_id;

	user.save(function(err, user){
		if(callback) callback(user);
	});
};


var user_need_create_home = function(data, callback){
	UserModel.findOne({phone: data.phone}, function(err, user){
		callback(user.need_create_home(data));
	});
};

var update_user = function(data, need_new_home, callback){
	UserModel.update_user(data, need_new_home, callback);
};

var login = function(username, password, callback){
	UserModel.findOne({phone: username, password: password},'-_id -__v -password', function(err, user){
		if(err) throw err;
		if(user){
			user.login();
			user.generate_session_code();
			user.save();
		}
		callback(user);
	});
};

var get_user_information = function(user_id, callback){
	UserModel.findOne({user_id: user_id}, '-_id -__v -password -current_session_token', function(err, user){
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

/*
 * Add a user to a user's contractor.
 *
 */

var add_user_to_a_user_contractor = function(user_id, new_user_id, relation, nickname){
	UserModel.add_contractor_to_a_person(user_id, new_user_id, relation, nickname);
};

/*
 * Get user contract info.
 *
 */

var get_user_contact_list = function(user_id, callback){
	UserModel.findOne({user_id: user_id}, '-_id contact')
	.populate('contact.user_id', 'first_name last_name avatar gender marital_status')
	.exec(function(err, contact){
		if(err) throw err;
		callback(contact);
	});
};

module.exports = {
	create_new_user: create_new_user,
	check_user_exist: check_user_exist,
	check_phone_register: check_phone_register,
	update_user: update_user,
	login: login,
	get_user_information: get_user_information,
	get_user_by_phone: get_user_by_phone,
	get_user_by_id: get_user_by_id,
	get_user_joined_home: get_user_joined_home,
	add_home_to_a_person: add_home_to_a_person,
	user_need_create_home: user_need_create_home,
	add_user_to_a_user_contractor: add_user_to_a_user_contractor,
	get_user_contact_list: get_user_contact_list,
};
