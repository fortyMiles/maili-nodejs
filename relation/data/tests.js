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

describe('Relation Caculation', function(){
	describe('#get_converse_relation()', function(){
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

	describe('#get_title()', function(){

		var test_data = [
			[true, 1, 0, '丈夫'],

			[true, 2, 0, '亲家'],
			[true, 2, 1, '亲家'],

			[true, 3, 0, '亲家'],
			[true, 3, 1, '亲家'],
			[true, 3, 2, '丈夫'],

			[true, 4, 0, '父亲'],
			[true, 4, 1, '母亲'],
			[true, 4, 2, '岳父'],
			[true, 4, 3, '岳母'],

			[true, 5, 0, '公公'],
			[true, 5, 1, '婆婆'],
			[true, 5, 2, '父亲'],
			[true, 5, 3, '母亲'],
			[true, 5, 4, '丈夫'],

			[true, 6, 0, '爷爷'],
			[true, 6, 1, '奶奶'],
			[true, 6, 2, '外公'],
			[true, 6, 3, '外婆'],
			[true, 6, 4, '父亲'],
			[true, 6, 5, '母亲'],

			[false, 0, 1, '妻子'],
			[false, 0, 2, '亲家'],
			[false, 0, 3, '亲家'],
			[false, 0, 4, '女儿'],
			[false, 0, 5, '儿媳'],
			[false, 0, 6, '孙女'],

			[false, 1, 2, '亲家'],
			[false, 1, 3, '亲家'],
			[false, 1, 4, '女儿'],
			[false, 1, 5, '儿媳'],
			[false, 1, 6, '孙女'],

			[false, 2, 3, '妻子'],
			[false, 2, 4, '女婿'],
			[false, 2, 5, '女儿'],
			[false, 2, 6, '外孙女'],

			[false, 3, 4, '女婿'],
			[false, 3, 5, '女儿'],
			[false, 3, 6, '外孙女'],

			[false, 4, 5, '妻子'],
			[false, 4, 6, '女儿'],

			[false, 5, 6, '女儿'],


			[true, 0, 1, '妻子'],
			[true, 0, 2, '亲家'],
			[true, 0, 3, '亲家'],
			[true, 0, 4, '儿子'],
			[true, 0, 5, '儿媳'],
			[true, 0, 6, '孙子'],

			[true, 1, 2, '亲家'],
			[true, 1, 3, '亲家'],
			[true, 1, 4, '儿子'],
			[true, 1, 5, '儿媳'],
			[true, 1, 6, '孙子'],

			[true, 2, 3, '妻子'],
			[true, 2, 4, '女婿'],
			[true, 2, 5, '儿子'],
			[true, 2, 6, '外孙'],

			[true, 3, 4, '女婿'],
			[true, 3, 5, '儿子'],
			[true, 3, 6, '外孙'],

			[true, 4, 5, '妻子'],
			[true, 4, 6, '儿子'],

			[true, 5, 6, '儿子'],

		];


			test_data.map(function(entry){

				var end_is_male = entry[0];
				var start = entry[1];
				var end = entry[2];
				var expected = entry[3];

				it('should return ' + expected +' when (start, end) == ('+ start +','+ end +')', function(){

				var relation = R.get_title(start, end, end_is_male);

				assert.equal(relation, expected);
			});
		});

	});
});

