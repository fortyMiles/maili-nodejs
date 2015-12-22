/*
 * Tests of relation module.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-21-Dec
 *
 */

var db_connection = require('../../configuration/test_db.js');

require('blanket')({
	pattern: function (f){
		return !/node_modules/.test(f);
	}
});

var Home = require('../model.js').Home;
var Relation = require('../model.js').Relation;
var Home = require('../model.js').Home;
var User = require('../../account/model.js').User;
var chai = require('chai');

var assert = chai.assert;

describe('Home Model', function(){
	var home_info = {
		home_id: '001',
		creator: '18857453090',
	};

	var home = new Home(home_info);

	describe('#add_member()', function(){

		var member = '18668831228';
		home.add_member(member);

		it('member list length should be 1', function(){
			assert.lengthOf(home.member, 1);
		});

		it('member list 0 should be the one just added in', function(){
			assert.equal(home.member[0].username, member);
		});
	});
});


describe('Relation Model', function(){
	describe('#create_converse_relation()', function(){
		it('should give 弟弟 when user1 called user2 哥哥 and user1 is a male', function(done){

			var user1 = {
				gender: 'M',
				phone: '18857453090',
				passsword: 'password',
			};

			var user2 = {
				gender: 'M',
				phone: '18857453091',
				passsword: 'password',
			};

			var relation = '哥哥';
			var excepted_relation = '弟弟';

			var little = new User(user1);
			var brother = new User(user2);
			
			var user1_is_male = true;

			Relation.create_converse_relation(user1.phone, user2.phone, relation, 'H', user1_is_male , function(new_relation){
				assert.equal(new_relation, excepted_relation);
				done();
			});
		});
	});

	describe('#add_person_to_a_home()', function(){
		it('should add a person to a home member list', function(done){
			var person = '11111';
			var home_id = 'home_id';
			Home.add_person_to_a_home(home_id, person, function(home){
				assert.isNotNull(home);
				assert.lengthOf(home.member, 1);
				done();
			});
		});
	});
});

describe('Relation Handler', function(){
	var handler = require('../handler.js');

	describe('#create_home()', function(){

		var home_id = 'home_id';
		var creator = 'creator';

		it('should save a home, which home_id is saved home_id', function(done){
			handler.create_home(home_id, creator, function(home){
				assert.equal(home.home_id, home_id);
				assert.equal(home.creator, creator);
				done();
			});
		});

	});

	describe('#get_home_by_id()', function(){
		it('should get a home, which home is is paramter id', function(done){

			var home_id = 'home_id';
			handler.get_home_by_id(home_id, function(home){
				assert.equal(home.home_id, home_id);
				done();
			});

		});
	});
	
});

