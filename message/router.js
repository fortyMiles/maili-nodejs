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

router.get('/unique_code/:unique_code',
		   controller.get_message_by_unique_code
		  );

router.get('/p2p/history/:last_unique_code/:receiver_id/:sender_id/:step',
		   controller.get_history_p2p_message
		  );

router.get('/p2g/history/:last_unique_code/:group_id/:step',
		   controller.get_history_p2g_message
		  );

		  /*
router.get('/feed/history/:last_unique_code/:receicer_id/:step',
		   controller.get_history_feed_message
		  );
		  */

router.get('/feed/unread/:receiver_id/:',
		   controller.get_unread_feed_message
		  );

