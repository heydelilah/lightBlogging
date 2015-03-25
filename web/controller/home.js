define(function(require, exports){
	var core = require('core');

	exports.onMain = function(boot,data,app){

		core.create('web/project/home.base');

	};
});