/*
 * Test for maili.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var Q = require('q');
var mongoose = require('mongoose');

chai.use(chaiAsPromised);

chai.should();

var assert = chai.assert;

var decode_token = function(code){
    var length = Number(code.slice(-1));
	var random_number = code.slice(-1*(1 + length), -1);
	var code_phone = code.slice(0, -1 * (1 + length));
	return code_phone/random_number;
};

describe('Account Model', function(){
	var Model = require('../model.js');

	var data = {
		first_name: '高1',
		phone: '18857453090',
		password: '11111111',
		gender: 'F',
	};


	describe('#create_new_user()', function(){
		it('return same phone number when creat finished', function(done){
			var user = new Model.User(data);
			assert.equal(user.phone, '18857453090');
			done();
		});

		it('should not be a male', function(done){
			var user = new Model.User(data);
			assert.isNotTrue(user.is_male());
			done();
		});
	});

	describe('#create_id_by_name_and_time()', function(){
		it('should not null and no exception when create id by feed name and phone number', function(){
			assert.isNotNull(Model.create_id_by_name_and_time(data.phone, 'relation'));
		});
	});

	describe('#initial_self_home()', function(){
		it('should create a new defalut home in self model, \nthis default name should include data.phone', function(done){
			var user = new Model.User(data);
			user.initial_self_home();
			assert.isNotNull(user.default_home);
			assert.include(user.default_home, data.phone);
			done();
		});
	});

	describe('#add_a_home()', function(){
		var user = new Model.User(data);
		user.add_a_home('1885745309000001', '18668831228');

		it('should add a home in his home list. And for the beginning, his home list length should be 1', function(done){
			assert.lengthOf(user.home, 1);
			done();
		});
	});

	describe('#generate_session_code()', function(){
		var user = new Model.User(data);
		user.generate_session_code();

		it('should have a current_session_token property', function(done){
			assert.property(user, 'current_session_token');
			done();
		});
		it('asserts not be none', function(done){
			assert.isNotNull(user.current_session_token);
			assert.ok(user.current_session_token);
			done();
		});

		it('asserts could be checked', function(done){
			assert.equal(decode_token(user.current_session_token), data.phone);
			done();
		});

	});

	describe('#initial_feed_group', function(){

		var user = new Model.User(data);
		user.initial_feed_group();

		it('should initial two feed groups', function(done){
			assert.lengthOf(user.feed_group, 2);
			done();
		});

		it('should one nikename is relation another is global', function(done){
			assert.equal(user.feed_group[0].group_nickname, 'relation');
			assert.equal(user.feed_group[1].group_nickname, 'global');
			done();
		});

		it('first group id should not equal with second group id', function(done){
			assert.notEqual(user.feed_group[0].group_id, user.feed_group[1].group_id);
			done();
		});
	});

	describe('#add_contractor()', function(){

		var user = new Model.User(data);
		user.add_contractor('user_id');
        
		it('should add a new friend, contract list length should be one', function(done){
			assert.lengthOf(user.contract, 2);
			done();
		});

		it('should have defalut relation F', function(done){
			assert.equal(user.contract[0].relation, 'F');
			done();
		});

		user.add_contractor('user_id', 'R');

		it('should add two new friend, contract list length should be two', function(done){
			assert.lengthOf(user.contract, 2);
			done();
		});

		it('should have a new relation R', function(done){
			assert.equal(user.contract[1].relation, 'R');
			done();
		});

	});

});

describe('User Handler', function(){

	var handler = require('../handler.js');

	describe('#get_user_by_phone()', function(){
		it('should give a user have same phone number of parameter phone number', function(done){
			var phone = '18857453090';
			handler.get_user_by_phone(phone, function(user){
				assert.equal(user.phone, phone);
				done();
			});
		});
	});
});

if(require.main == module){
	var code = '1078250310233110571795';
	var phone = decode_token(code);
	console.log(phone);
}
