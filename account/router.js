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
var jwt = require('jsonwebtoken');

router.use(function(req, res, next){
	next();
});

router.route('/user/')
.post(
	_.curry(middleware.check_paramter_lack)(['phone', 'password']),
	middleware.check_duplicate,
	middleware.verify_boolean,
	middleware.verify_gender,
	middleware.change_password_to_md5,
	controller.create_user
)
.put(
	_.curry(middleware.check_paramter_lack)(['phone']),
	middleware.check_user_phone_exist,
	middleware.verify_boolean,
	middleware.verify_gender,
	middleware.change_password_to_md5,
	controller.update_user
);

router.get('/info/:user_id', 
		   controller.get_user_information);
router.get('/exist/:username', controller.check_user_exist);
router.get('/home_list/:user_id', 
		   middleware.check_user_exist_by_params,
		   controller.get_home_list);


router.post('/login/', 
			middleware.change_password_to_md5,
			controller.login_user
		   );
router.post('/captcha/', controller.get_captcha);

router.get('/contact/:user_id',
		   middleware.check_user_exist_by_params,
		   controller.get_contract_list);

//router.get('/relation_id/:username', controller.get_relation_id);
//router.get('/friend_id/:username', controller.get_friend_id);

router.get('/scope/:user_phone', 
		   middleware.check_user_exist_by_params,
		   controller.get_feed_scope);

router.get('/token/:token',
		  middleware.check_token,
		  controller.parse_token
		  );

router.get('/if-have-login/:user_id',
		   middleware.check_user_exist_by_params,
		   controller.test_if_have_logined
		  );

module.exports = router;
