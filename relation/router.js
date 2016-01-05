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
var account_middleware = require('../account/middleware.js');
var _ = require('ramda');

router.use(function(req, res, next){
	console.log('check token');
	next();
});

router.post('/create/', 
			_.curry(account_middleware.check_paramter_lack)(['inviter', 'invitee', 'home_id', 'invitee_position',  'scope']),
			middleware.change_to_position_code,
//			middleware.check_relation_acceptable,
			_.curry(middleware.change_id_to_model)('home'),
			_.curry(middleware.change_id_to_model)('inviter'),
			_.curry(middleware.change_id_to_model)('invitee'),
			controller.create_relation,
			controller.add_invitee_to_home);

router.get('/contract/:username', controller.get_contract);

router.get('/home_member/:username', controller.get_home_member);
router.get('/relation_id/:username', controller.get_relation_id);
router.get('/friend_id/:username', controller.get_friend_id);
router.get('/home_creator/:home_id', controller.get_home_creator);
router.get('/info/:user1/:user2/', controller.get_realtion_info);
router.get('/:home_id', controller.get_home_info);

module.exports = router;
