/*
 * Define the value of different realtion.
 *
 * @Author Minchiuan Gao <minchiuan.gao@gmail.com>
 * @Date 2015-17-Dec
 *
 */

var value = {
	'妻子': {weight: 1, level:1, ctf: '丈夫', ctm: '丈夫'},
	'丈夫': {weight: 1, level:1, ctf: '妻子', ctm: '妻子'},
	'儿子': {weight: 2, level:1, ctf: '母亲', ctm: '父亲'},
	'女儿': {weight: 2, level:1, ctf: '母亲', ctm: '父亲'},
	'弟弟': {weight: 3, level:1, ctf: '姐姐', ctm: '哥哥'},
	'哥哥': {weight: 3, level:1, ctf: '妹妹', ctm: '弟弟'},
	'妹妹': {weight: 3, level:1, ctf: '姐姐', ctm: '哥哥'},
	'姐姐': {weight: 3, level:1, ctf: '妹妹', ctm: '弟弟'},
	'父亲': {weight: 3, level:1, ctf: '女儿', ctm: '儿子'},
	'母亲': {weight: 3, level:1, ctf: '女儿', ctm: '儿子'},
	'孙子': {weight: 4, level:2, ctf: '奶奶', ctm: '爷爷'},
	'孙女': {weight: 4, level:2, ctf: '奶奶', ctm: '爷爷'},
	'女婿': {weight: 4, level:2, ctf: '岳母', ctm: '岳父'},
	'媳妇': {weight: 4, level:2, ctf: '婆婆', ctm: '公公'},
	'爷爷': {weight: 5, level:2, ctf: '孙女', ctm: '孙子'},
	'奶奶': {weight: 5, level:2, ctf: '孙女', ctm: '孙子'},
	'岳父': {weight: 5, level:2, ctf: '女婿', ctm: '女婿'},
	'岳母': {weight: 5, level:2, ctf: '女婿', ctm: '女婿'},
	'公公': {weight: 5, level:2, ctf: '媳妇', ctm: '媳妇'},
	'婆婆': {weight: 5, level:2, ctf: '媳妇', ctm: '媳妇'},
};

module.exports = {
	value: value,
};
