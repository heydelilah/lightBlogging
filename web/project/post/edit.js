define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');


	// 详情页
	var Edit = {
		init: function(config){
			var self = this;

			// 创建底层容器
			var el = this.$el = $('<div class="P-detail"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			var self = this;
			util.loadTpl('detail.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template()

				// 插入到浏览器页面
				el.append(dom);

				self.load(config.param);
			});
		}
	}
	exports.base = Edit;
	
});
