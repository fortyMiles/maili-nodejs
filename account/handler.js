/*
 * Data handler.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2016-17-Dec
 *
 */

var mongoose = require('mongoose');
var MONGO_URL = 'mongodb://121.40.158.110/maili_user';
mongoose.connect(MONGO_URL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect error'));
db.once('open', function(){
	console.log('db connected');
});

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

	var initial_feeds = ['home', 'relation', 'friend'];
	initial_feeds.map(user.add_feed_group, user);

	user.save(function(err){
		if(err) throw err;
		callback(err);
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
		callback(user);
		if(user){
			user.login();
			user.save();
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
