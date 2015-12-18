var _ = require('ramda');

var func = function(x){
	console.log(x.a);
	console.log(y[0]);
	console.log(z);
};

var dic = {a: 'test'};

var func_dic = _.curry(func)(dic);

var array = [1, 2,3,4];
var func_dic_array = func_dic(array);

func_dic_array(10);
