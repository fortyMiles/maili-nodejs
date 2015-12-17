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

router.use(function(req, res, next){
	console.log('check token');
	next();
});

router.get('/info/:username', controller.get_user_information);
router.get('/exist/:username', controller.check_user_exist);

router.route('/user/')
.post(controller.create_user)
.put(controller.update_user);

router.post('/login/', controller.login_user);
router.post('/captcha/', controller.get_captcha);

module.exports = router;
