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

router.use(function(req, res, next){
	console.log('check token');
	next();
});

router.route('/user/')
.post(
	middleware.check_register_paramter_lack,
	middleware.check_duplicate,
	controller.create_user
)
.put(
	middleware.check_update_paramter_lack,
	middleware.check_user_exist,
	controller.update_user
);

router.get('/info/:username', controller.get_user_information);
router.get('/exist/:username', controller.check_user_exist);
router.get('/home_list/:user_phone', controller.get_home_list);


router.post('/login/', controller.login_user);
router.post('/captcha/', controller.get_captcha);

module.exports = router;
