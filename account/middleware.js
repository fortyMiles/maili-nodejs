/*
 * Middle for account.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date: 2015-23-Dec
 *
 */


var handler = require('./handler.js');
var _ = require('ramda');
var md5 = require('md5');
var jwt = require('jsonwebtoken');

var check_token = function(req, res, next){
	var token = req.params.token || null;
	var SECERT = 'foremly';
	if(token){
		jwt.verify(token, SECERT, function(err, decode){
			if(err){
				res.status(412);
				res.json({err: 'token is invalid'});
			}else{
				next();
			}
		});
	}else{
		next();
	}
};

var verify_boolean = function(req, res, next){
	var false_str = 'false';
	var true_str = 'true';

	if('marital_status' in req.body){
		var str_format = req.body.marital_status.toString().toLowerCase();
		if(str_format == false_str){
			req.body.marital_status = false;
			next();
		}else if(str_format == true_str){
			req.body.marital_status = true;
			next();
		}else{
			res.status(400);
			res.json({error: 'key error: marital_status'});
		}
	}else{
		next();
	}
};

var verify_gender = function(req, res, next){
	var male = 'M';
	var female = 'F';

	if('gender' in req.body){
		var str_format = req.body.gender.toString().toUpperCase();
		if(str_format == male){
			req.body.gender = male;
			next();
		}else if(str_format == female){
			req.body.gender = female;
			next();
		}else{
			res.status(400);
			res.json({error: 'key error: gender'});
		}
	}else{
		next();
	}
};

var check_user_id_exist = function(req, res, next){
	handler.check_user_exist(req.body.user_id, function(count){
		if(count > 0){
			next();
		}else{
			res.status(404);
			res.json({error: 'can not locate use by this user_id, maybe you have an error with user_id value'});
		}
	});
};

var check_user_exist_by_params = function(req, res, next){
	handler.check_user_exist(req.params.user_id, function(count){
		if(count > 0){
			next();
		}else{
			res.status(404);
			res.json({error: 'user not exist'});
		}
	});
};

var check_duplicate = function(req, res, next){
	handler.check_phone_register(req.body.phone, function(count){
		if(count > 0){
			res.status(409);
			res.json({error: 'user deplicated'});
		}else{
			next();
		}
	});
};


var check_user_phone_exist = function(req, res, next){
	handler.check_phone_register(req.body.phone, function(count){
		if(count > 0){
			next();
		}else{
			res.status(404);
			res.json({error: 'user not exist'});
		}
	});
};

var check_user_exist = function(req, res, next){
	handler.check_user_exist(req.body.phone, function(count){
		if(count > 0){
			next();
		}else{
			res.status(404);
			res.json({error: 'user not exist'});
		}
	});
};

/*
 * Check if there are lack paramters.
 *
 */

var check_paramter_lack = function(need_paramter, req, res, next){
	var lack_paramter = [];
	var lack = false;

	var paramter = req.body;

	need_paramter.map(function(p){
		if(!(p in paramter)){
			lack = true;	
			lack_paramter.push(p);
		}
	});

	if(lack){
		res.status(400);
		res.json({error: 'without key: ' + lack_paramter});
	}else{
		next();
	}
};

/*
 * Change password from string into md5, if string is not md5.
 *
 */

var change_password_to_md5 = function(req, res, next){
	var reg_exp = '^[a-f0-9]{32}$';

	var password = req.body.password || "";

	var is_md5 = password.match(reg_exp);

	if(!is_md5 && password !== ""){
		req.body.password = md5(password);
		next();
	}else{
		next();
	}
};

module.exports = {
	check_duplicate: check_duplicate,
	check_user_exist: check_user_exist,
	check_user_id_exist: check_user_id_exist,
	check_user_phone_exist: check_user_phone_exist,
	check_user_exist_by_params: check_user_exist_by_params,
	change_password_to_md5: change_password_to_md5,
	check_paramter_lack: check_paramter_lack,
	verify_boolean: verify_boolean,
	verify_gender: verify_gender,
	check_token: check_token,
};
