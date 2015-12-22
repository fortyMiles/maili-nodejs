/*
 * Configuration of db connection.
 *
 * @Author Minchiuan Gao <minchuian.gao@gmail.com>
 * @Date 2015-21-Dec
 */

var mongoose = require('mongoose');
var MONGO_URL = 'mongodb://localhost/maili_test';
mongoose.connect(MONGO_URL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect error'));
db.once('open', function(){
	console.log('db connected');
});


