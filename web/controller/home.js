define(function(require, exports){
	var core = require('core');

	exports.onMain = function(boot,data){

		core.create('home', 'web/project/home.base');

	};
});