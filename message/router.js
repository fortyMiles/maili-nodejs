/*
 * Get history message.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-14-Jan
 */

var express = require('express');
var router = express.Router();
var controller = require('./controller.js');

module.exports = router;

router.use(function(req, res, next){
	next();
});

router.get('*',
		   controller.redirect_to_socket
		  );
