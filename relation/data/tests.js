/*
 * Test of relation value dic.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-21-Dec
 *
 */


var R = require('./relation_value.js');

var chai = require('chai');

var assert = chai.assert;

describe('Get converse relation', function(){
	describe('#get_converse_relation', function(){
		it('should relation 丈夫 if A calls B 妻子, and A is male', function(){
			var is_male = true;
			var relation = '妻子';
			var converse = '丈夫';
			assert.equal(R.get_converse_relation(is_male, relation), converse);
		});
	});

	describe('#get_converse_relation', function(){
		it('should relation 儿子 if A calls B 妈妈, and A is male', function(){
			var is_male = true;
			var relation = '母亲';
			var converse = '儿子';
			assert.equal(R.get_converse_relation(is_male, relation), converse);
		});
	});

	describe('#get_converse_relation', function(){
		it('should relation 孙女 if A calls B 爷爷, and A is female', function(){
			var is_male = false;
			var relation = '爷爷';
			var converse = '孙女';
			assert.equal(R.get_converse_relation(is_male, relation), converse);
		});
	});
});

