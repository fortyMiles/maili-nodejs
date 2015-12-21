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
		if(callback) callback(user.current_session_token);
	});
};


var update_user = function(data, callback){
	var phone = data.phone;

	UserModel.update({phone:phone}, data, function(err, number_affected){
		callback(number_affected);
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
	UserModel.findOne({phone: username}, '-_id phone first_name gender marital_status nickname avatar', function(err, user){
		if(err) throw err;
		callback(user);
	});
};


module.exports = {
	create_new_user: create_new_user,
	check_user_exist: check_user_exist,
	update_user: update_user,
	login: login,
	get_user_information: get_user_information,
};
