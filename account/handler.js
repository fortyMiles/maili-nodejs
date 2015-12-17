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


var check_user_exist = function(user_phone){};

var create_new_user = function(data){
	var user = new UserModel(data);
	user.register_data = new Date();
	user.is_login = true;

	var initial_feeds = ['home', 'relation', 'friend'];
	initial_feeds.map(user.add_feed_group, user);

	user.save(function(err){
		if(err) throw err;
	});
};

module.exports = {
	create_new_user: create_new_user,
	test_func: test_func
};
