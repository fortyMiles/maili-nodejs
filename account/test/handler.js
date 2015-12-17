var assert = require('assert');
var handler = require('../handler.js');
var data = {
	first_name: '高',
	phone: '18857453090',
	password: '123456',
};
handler.create_new_user(data);

