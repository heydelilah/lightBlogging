define(function(require, exports){
	var core = require('core');

	// 注册
	exports.onSignup = function(boot,data,app){
		var name = "signup";
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/admin/user.signup');	
		}else{
			core.changeScene(name);
			mod.reset();
		}
	};

	// 登陆
	exports.onLogin = function(boot,data,app){
		var name = "login";
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/admin/user.login');	
		}else{
			core.changeScene(name);
			mod.reset();
		}
	};

});