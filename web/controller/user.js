define(function(require, exports){
	var core = require('core');

	exports.onMain = function(boot,data,app){
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/admin/user.base');	
		}else{
			core.changeScene(name);
			// mod.reload();
		}
	};
});