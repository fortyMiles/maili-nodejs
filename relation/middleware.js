/*
 * Middleware of realtion module.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 *
 * @Date 2015-21-Dec
 *
 */

/*
 * Change user's id to user object and change home's id to home object.
 *
 * @api public
 *
 */
var check_parameter = function(req, res, next){
	var paramters = ['user1_is_male', 'relation', 'user1', 'user2', 'scope'];

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


