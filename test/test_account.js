/*
 * Test HTTP for account.
 *
 */

var supertest = require('supertest'),
	express = require('express');

var app = require('../index.js').app;

var assert = require('chai').assert;
var api = supertest('http://localhost:3000');

process.env.NODE_ENV = 'test';


describe('Acceunt', function(){
	describe('Post /account/user', function(){
		it('create father, response with json', function(done){
			var post_data = {
				phone: "13993300098",
				password: "1234456",
				gender: "M",
				marital_status: true,
				first_name: "高"
			};

			api.post('/account/user/')
			.send(post_data)
			.expect(201)
			.end(function(err, res){
				if(err){ throw err;}
				assert.property(res.body, 'token');
				done();
			});
		});

		it('create mother, response with json', function(done){
			var post_data = {
				phone: "18898890088",
				password: "1234456",
				gender: "F",
				marital_status: true,
				first_name: "李"
			};

			api.post('/account/user/')
			.send(post_data)
			.expect(201)
			.end(function(err, res){
				if(err){ throw err;}
				assert.property(res.body, 'token');
				done();
			});
		});

		it('create child, response with json', function(done){
			var post_data = {
				phone: "13887764388",
				password: "1234456",
				gender: "M",
				marital_status: false,
				first_name: "高"
			};

			api.post('/account/user/')
			.send(post_data)
			.expect(201)
			.end(function(err, res){
				if(err){ throw err;}
				assert.property(res.body, 'token');
				done();
			});
		});


		it('create grandpd, response with json', function(done){
			var post_data = {
				phone: "18876654388",
				password: "1234456",
				gender: "M",
				marital_status: true,
				first_name: "高"
			};

			api.post('/account/user/')
			.send(post_data)
			.expect(201)
			.end(function(err, res){
				if(err){ throw err;}
				assert.property(res.body, 'token');
				done();
			});
		});
	});
});
