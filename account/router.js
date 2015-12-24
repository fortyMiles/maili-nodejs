/*
 * Account Module Router.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var express = require('express');
var router = express.Router();
var controller = require('./controller.js');
var middleware = require('./middleware.js');
var _ = require('ramda');

router.use(function(req, res, next){
	console.log('check token');
	next();
});

router.route('/user/')
.post(
	_.curry(middleware.check_paramter_lack)(['phone', 'password']),
	middleware.check_duplicate,
	middleware.verify_boolean,
	controller.create_user
)
.put(
	_.curry(middleware.check_paramter_lack)(['phone']),
	middleware.check_user_exist,
	middleware.verify_boolean,
	controller.update_user
);

router.get('/info/:username', 
		   middleware.check_user_exist,
		   controller.get_user_information);
router.get('/exist/:username', controller.check_user_exist);
router.get('/home_list/:user_phone', controller.get_home_list);


router.post('/login/', controller.login_user);
router.post('/captcha/', controller.get_captcha);

module.exports = router;
