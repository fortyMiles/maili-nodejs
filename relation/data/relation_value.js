/*
 * Define the value of different realtion.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var _ = require('ramda');
var assert = require('assert');

var VALUE = {
	'自己': {code: 0, weight: 0, level:0, ctf: '自己', ctm: '自己'},
	'妻子': {code: 1, weight: 1, level:1, ctf: '丈夫', ctm: '丈夫'},
	'丈夫': {code: 2, weight: 1, level:1, ctf: '妻子', ctm: '妻子'},
	'儿子': {code: 3, weight: 2, level:1, ctf: '母亲', ctm: '父亲'},
	'女儿': {code: 4, weight: 2, level:1, ctf: '母亲', ctm: '父亲'},
	'弟弟': {code: 5, weight: 3, level:1, ctf: '姐姐', ctm: '哥哥'},
	'哥哥': {code: 6, weight: 3, level:1, ctf: '妹妹', ctm: '弟弟'},
	'妹妹': {code: 7, weight: 3, level:1, ctf: '姐姐', ctm: '哥哥'},
	'姐姐': {code: 8, weight: 3, level:1, ctf: '妹妹', ctm: '弟弟'},
	'父亲': {code: 9, weight: 3, level:1, ctf: '女儿', ctm: '儿子'},
	'母亲': {code: 10, weight: 3, level:1, ctf: '女儿', ctm: '儿子'},
	'孙子': {code: 11, weight: 4, level:2, ctf: '奶奶', ctm: '爷爷'},
	'孙女': {code: 12, weight: 4, level:2, ctf: '奶奶', ctm: '爷爷'},
	'外孙女': {code: 13, weight: 4, level:2, ctf: '外婆', ctm: '外公'},
	'外孙': {code: 14, weight: 4, level:2, ctf: '外婆', ctm: '外公'},
	'女婿': {code: 15, weight: 4, level:2, ctf: '岳母', ctm: '岳父'},
	'儿媳': {code: 16, weight: 4, level:2, ctf: '婆婆', ctm: '公公'},
	'爷爷': {code: 17, weight: 5, level:2, ctf: '孙女', ctm: '孙子'},
	'奶奶': {code: 18, weight: 5, level:2, ctf: '孙女', ctm: '孙子'},
	'外公': {code: 19, weight: 5, level:2, ctf: '外孙女', ctm: '外孙'},
	'外婆': {code: 20, weight: 5, level:2, ctf: '外孙女', ctm: '外孙'},
	'岳父': {code: 21, weight: 5, level:2, ctf: '女婿', ctm: '女婿'},
	'岳母': {code: 22, weight: 5, level:2, ctf: '女婿', ctm: '女婿'},
	'公公': {code: 23, weight: 5, level:2, ctf: '儿媳', ctm: '儿媳'},
	'婆婆': {code: 24, weight: 5, level:2, ctf: '儿媳', ctm: '儿媳'},
	'亲家': {code: 25, weight: 6, level:3, ctf: '亲家', ctm: '亲家'},
};

var TITLES = [];

for(var title in VALUE){
	TITLES.push(title);
}

/*
 * Define the different position how to call another position.
 *
 */

var relationMaxtix = {
	1:{0: 2},
	2:{0: 25, 1: 25},
	3:{0: 25, 1: 25, 2: 2},
	4:{0: 9,  1: 10, 2: 21, 3: 22},
	5:{0: 23, 1: 24, 2: 9,  3: 10, 4: 2},
	6:{0: 17, 1: 18, 2: 19, 3: 20, 4: 9, 5:10},
};

/*
 * Get title.
 *
 * @param {String} start position
 * @param {String} end position
 * @param {Boolean} end if is male. if A is an old man, B is a young person, when B is male, the title resutle could be 孙子, but when B is famle, result could be 孙女.
 *
 */

var get_title = function(start, end, end_is_male){
	var relation_code = null;
	if(start > end){
		relation_code = relationMaxtix[start][end];
		relation = TITLES[relation_code];
	}else{
		// get converse relation.
		converse_relation_code = relationMaxtix[end][start]; 
		converse_relation = TITLES[converse_relation_code]; // get 爷爷
		assert.equal(converse_relation in VALUE, true);
		relation = get_converse_relation(end_is_male, converse_relation); // get 孙女 or 孙子
	}
	
	return relation;
};

/*
 * Get converse female relation.
 *
 * @param {String} relation value dictionary.
 * @param {Boolean} if person a is male. A called B father, is A is famle A is B's son, else A is B's daughter.
 * @param {String} A called B what.
 * 
 * @return {String} converse relation.
 *
 */

var get_converse_relation_from_value_dic = function(value_dic, is_male, relation){
	if(is_male){
		return value_dic[relation].ctm;
	}else{
		return value_dic[relation].ctf;
	}
};

/*
 * Get relation from this value.
 */

var get_converse_relation = _.curry(get_converse_relation_from_value_dic)(VALUE);

/*
 * Check if key in a dictionary.
 *
 */

var key_in_dic = function(relation_dic, relation){
	return relation in relation_dic;
};

/*
 * Tests this value if is acceptable.
 *
 * @param {String} relation
 *
 * @return {Boolean} if this relation is acceptable.
 *
 */

var relation_accept = _.curry(key_in_dic)(VALUE);


module.exports = {
	get_converse_relation: get_converse_relation,
	relation_accept: relation_accept,
	get_title: get_title,
};
