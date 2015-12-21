/*
 * Middleware of realtion module.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 *
 * @Date 2015-21-Dec
 *
 */

var relation_value = require('./data/relation_value.js');
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
 * check if content with required paramter format.
 *
 * @api public
 *
 */
var check_parameter = function(req, res, next){
	var paramters = ['user1_is_male', 'user1_name', 'relation', 'user1', 'user2', 'scope', 'home_id'];

	var lack = false;
	var lack_paramter = [];
	paramters.map(function(p){
		if((p in req.body) === false){
			lack = true;
			lack_paramter.push(p);
		}
	});

	if(lack){
		res.status(400);
		res.json({error: 'lack of paramter: ' + lack_paramter.toString()});
	}else{
		next();
	}
};


module.exports = {
	check_parameter: check_parameter,
	check_relation_acceptable: check_relation_acceptable,
};

