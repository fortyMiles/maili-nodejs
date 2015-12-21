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
	var user_phone = req.params.username;
	
	handler.get_user_information(user_phone,function(user){
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
	handler.check_user_exist(req.params.username, function(count){
		console.log(count);
		if(count === 0){
			res.status(200);
			res.json({exist: false});
		}else{
			res.status(200);
			res.json({exist: true});
		}
	});
};


var create_user = function(req, res, next){
	var data = req.body;

	handler.create_new_user(data, function(user){
		if(user){
			res.status(201);
			res.json({token: user.current_session_token});
			relation_handler.create_home(user.default_home, user.user_id, function(home){});
		}else{
			res.status(400);
			res.json({error: 'an error'});
		}
	});
};

var update_user = function(req, res, next){
    var data = req.body; 

	if(!('phone' in data)){
		res.status(400);
		res.json({error: 'without key: phone'});
	}else{
		_update(data, res);
	}
};


var _update = function(data, res){
	handler.update_user(data, function(number_affected){
		res.status(200);
		res.json({affectedNumber: number_affected.nModified});
	});
};


var login_user = function(req, res, next){
   var user_phone = req.body.phone;
   var password = req.body.password;
   handler.login(user_phone, password, function(token){
	   if(user){
		   res.status(201);
		   res.json({token: token});
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
	handler.get_user_joined_home(req.params.user_phone, function(homes){
		res.status(202);
		res.json({data: homes});
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
};
