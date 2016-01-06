/*
 * Controller of user.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2016-17-Dec
 *
 */

var handler = require('./handler.js');
var relation_handler = require('../relation/handler.js');
var _ = require('ramda');

var get_user_information = function(req, res, next){
	var user_id = req.params.user_id;
	
	handler.get_user_information(user_id,function(user){
		if(user){
			res.status(200);
			res.json({data: user});
		}else{
			res.status(404);
			res.json({error: 'no this person'});
		}

	});
};


var check_user_exist = function(req, res, next){
	handler.get_user_by_phone(req.params.username, function(user){
		res.status(200);
		if(user){
			res.json({
				exist: true,
				user_id: user.user_id,
			});
		}else{
			res.json({exist: false});
		}
	});
};


var create_user = function(req, res, next){
	var data = req.body;

	handler.create_new_user(data, function(user){
		if(user){
			res.status(201);
			res.json({token: user.current_session_token});

			if(user.need_home()){
				_create_home_by_user(user);
			}
		}else{
			res.status(400);
			res.json({error: 'paramter error'});
		}
	});
};

/*
 * Judge a person if need create a new home for him.
 *
 * @param {Model} user model

*/
var update_user = function(req, res, next){
	var data = req.body; 

	handler.user_need_create_home(data, function(need_create_home){
		handler.update_user(data, need_create_home, function(user){
	       _create_home_by_user(user);
		});
	});

	res.status(200);
	res.json({update: true});
};

/*
 * Create home by user.
 *
 */

var _create_home_by_user = function(user){
	if(user){
		relation_handler.create_home(
			user.default_home, 
			user,
			user.default_home_position, 
			function(home){}
		);
	}
};


var login_user = function(req, res, next){
	var user_phone = req.body.phone;
	var password = req.body.password;
	handler.login(user_phone, password, function(user){
		if(user){
			res.status(201);
			res.json({
				token: user.current_session_token,
				data: user
			});
		}else{
			res.status(406);
			res.json({error: 'account or password error'});
		}
	});
};


var get_captcha = function(req, res, next){
	var user_phone = req.body.phone;
	var code = user_phone.slice(-6);

	var mutiple = 87;
	var remain = 17;
	var TEN = 10;

	var new_code = "";

	for(var i in code){
		var answer = (Number(code[i]) * mutiple % remain) % TEN;
		new_code += answer.toString();
	}

	res.status(200);
	res.json({code: new_code});
};

/*
 * Get home list of a user.
 *
 */

var get_home_list = function(req, res, next){
	debugger;
	handler.get_user_joined_home(req.params.user_id, function(homes){
		res.status(202);
		res.json({data: homes});
	});
};

/*
 * Get contract list
 */

var get_contract_list = function(req, res, next){
	handler.get_user_by_phone(req.params.user_phone, function(user){
		res.status(200);
		res.json({data: user.contract});
	});
};

var get_home_info = function(req, res, next){
	handler.get_home_info(req.params.home_id, function(home){
		res.status(200);
		res.json({data: home});
	});
};

var get_feed_scope = function(req, res, next){
	handler.get_user_by_phone(req.params.user_phone, function(user){
		res.status(200);
		res.json({data:user.feed_group});
	});
};

module.exports = {
	get_user_information: get_user_information,
	check_user_exist: check_user_exist,
	create_user: create_user,
	update_user: update_user,
	login_user: login_user,
	get_captcha: get_captcha,
	get_home_list: get_home_list,
	get_contract_list: get_contract_list,
	get_home_info: get_home_info,
	get_feed_scope: get_feed_scope,
};
