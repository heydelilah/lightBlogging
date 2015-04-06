// 文章模块
define(function(require, exports){
	var core = require('core');

	// 列表页
	exports.onMain = function(boot,data){
		core.create('postList', 'web/project/post/main.base');
	};

	// 详情页
	exports.onDetail = function(boot,data){
		core.create('postDetail', 'web/project/post/detail.base', {'param': data.param});
	};

	// 编辑页
	exports.onEdit = function(boot, data){
		core.create('postEdit', 'web/project/post/edit.base');
	}
});