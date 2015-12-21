/*
 * Tests of relation module.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-21-Dec
 *
 */

var db_connection = require('../../configuration/db.js');
var Home = require('../model.js').Home;
var Relation = require('../model.js').Relation;
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
});

