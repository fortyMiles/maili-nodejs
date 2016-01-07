/*
 * Middleware of realtion module.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 *
 * @Date 2015-21-Dec
 *
 */

var relation_value = require('./data/relation_value.js');
var Home = require('./model.js').Home;
var User = require('../account/model.js').User;

/*
 * change position abbr to position number
 *
 */

var change_to_position_code = function(req, res, next){
	var postion_value = {'father': 4, 'mother': 5, 'gf': 0, 'gm': 1, 'gfl': 2, 'gml':3, 'child':6};
	if(req.body.invitee_position in postion_value){
		req.body.invitee_position = postion_value[req.body.invitee_position];
		next();
	}else{
		res.status(400);
		res.json({error: 'your postion is error'});
	}
};
/*
 * Change id to object.
 *
 */

var change_id_to_model = function(model, req, res, next){
	if(req.locals === undefined){
		req.locals = {};
	}

	var target_model = null;
	var restriction = {};

	if(model == 'home'){
		target_model = Home;
		restriction = {home_id: req.body.home_id};
	}else if(model == 'inviter' || model == 'invitee'){
		target_model = User;
		restriction = {user_id: req.body[model]};
	}else{
		throw(Error('unacceptable model name:' + model));
	}

	target_model.findOne(restriction, function(err, object){
		if(err) throw err;
		if(object){
			req.locals[model] = object;
			next();
		}else{
			res.status(404);
			res.json({model: ' this '+ model +' not exist'});
		}
	});
};

/*
 * Check if relation is accepctable.
 *
 * @api public
 *
 */

var check_relation_acceptable = function(req, res, next){
	if(relation_value.relation_accept(req.body.relation)){
		next();
	}else{
		res.status(400);
		res.json({relation_unacceptable: req.body.relation});
	}
};

/*
 * Check if invitee already in this home.
 *
 */

var check_inviter_and_invitee_acceptable = function(req, res, next){
	debugger;
	var invitee_already_in = false;
	var inviter_already_in = false;
	for(var i = 0; i < req.locals.home.member.length; i++){
		if(req.locals.home.member[i].user == req.locals.invitee.user_id){
			invitee_already_in = true;
		}
		if(req.locals.home.member[i].user == req.locals.inviter.user_id){
			inviter_already_in = true;
		}
	}

	if(invitee_already_in){
        res.status(409);
		res.json({confilct: 'invitee already in home'});
	}else if(inviter_already_in === false){
		res.status(401);
		res.json({unauthorized: 'this inviter can not invite person into this home.'});
	}else{
		next();
	}
};


/*
 * Check paramter required.
 *
 */


module.exports = {
	check_relation_acceptable: check_relation_acceptable,
	change_id_to_model: change_id_to_model,
	change_to_position_code: change_to_position_code,
	check_inviter_and_invitee_acceptable: check_inviter_and_invitee_acceptable,
};
