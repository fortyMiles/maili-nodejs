var mongoose = require('mongoose');
var MONGO_URL = 'mongodb://localhost/maili';
mongoose.connect(MONGO_URL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connect error'));
db.once('open', function(){
	console.log('db connected');
});


