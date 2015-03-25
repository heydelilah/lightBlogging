define(function(require, exports){
	var util = require('util');

	var Main = function(){
		var data = util.count(1,2);
		console.log('data is :'+ data)
	}
	exports.base = Main;


	var Main2 = function(){
		var data = util.count(1,2);
		console.log('data2 is :'+ data)
	}
	exports.test = Main2;
});