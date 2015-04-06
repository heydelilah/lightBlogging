// 文章模块
define(function(require, exports){
	var core = require('core');

	// 列表页
	exports.onMain = function(boot,data){
		var name = 'postList';
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/post/main.base');	
		}else{
			core.changeScene(name);
			mod.reload();
		}
	};

	// 详情页
	exports.onDetail = function(boot,data){
		var name = 'postDetail';
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/post/detail.base', {'param': data.param});
		}else{
			core.changeScene(name);
			// mod.reload();
		}
	};

	// 编辑页
	exports.onEdit = function(boot, data){
		var name = 'postEdit';
		var mod = core.get(name);
		if(!mod){
			core.create(name, 'web/project/post/edit.base');	
		}else{
			core.changeScene(name);
			mod.reset();
		}

	}
});