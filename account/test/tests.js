/*
 * Test for maili.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var Q = require('q');
var mongoose = require('mongoose');

chai.use(chaiAsPromised);

chai.should();

describe('Account Handler', function(done){
	var handler = require('../handler.js');
	var User = require('../model.js').User;

	describe('#create_new_user()', function(done){
		it('return null err when creat finished', function(){
			var data = {
				first_name: '高1',
				phone: '18857453090',
				password: '123456',
			};

			var user = new User(data);

			user.save(function(err){
				if(err) throw err;
				done();
			});
		});
	});
});
