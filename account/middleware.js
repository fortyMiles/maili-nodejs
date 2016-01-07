/*
 * Middle for account.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date: 2015-23-Dec
 *
 */


var handler = require('./handler.js');
var _ = require('ramda');

var verify_boolean = function(req, res, next){
	var false_str = 'false';
	var true_str = 'true';

	if(req.body){
		if('marital_status' in req.body){
			var str_format = req.body.marital_status.toString().toLowerCase();
			if(str_format == false_str){
				req.body.marital_status = false;
			}
			if(str_format == true_str){
				req.body.marital_status = true;
			}
		}
	}

	next();
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
	handler.check_user_exist(req.body.phone, function(count){
		if(count > 0){
			res.status(409);
			res.json({error: 'user deplicated'});
		}else{
			next();
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

module.exports = {
	check_duplicate: check_duplicate,
	check_user_exist: check_user_exist,
	check_user_exist_by_params: check_user_exist_by_params,
	check_paramter_lack: check_paramter_lack,
	verify_boolean: verify_boolean,
};
