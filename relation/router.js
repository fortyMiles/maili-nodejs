/*
 * Relation Module Router.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var express = require('express');
var router = express.Router();
var controller = require('./controller.js');
var middleware = require('./middleware.js');

router.use(function(req, res, next){
	console.log('check token');
	next();
});

router.post('/create/', 
			middleware.check_parameter, 
			middleware.check_relation_acceptable,
			controller.create_relation);

router.get('/contract/:username', controller.get_contract);

router.get('/home_member/:username', controller.get_home_member);
router.get('/home_id/:username', controller.get_home_id);
router.get('/relation_id/:username', controller.get_relation_id);
router.get('/friend_id/:username', controller.get_friend_id);
router.get('/home_creator/:home_id', controller.get_home_creator);
router.get('/info/:user1/:user2/', controller.get_realtion_info);

module.exports = router;
