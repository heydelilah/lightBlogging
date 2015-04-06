define(function(require, exports){
	var $ = require('jquery');
	var util = require('util');
	var core = require('core');
	var handlebars = require('handlebars');

	var Frame = {
		init: function(config, callback){
			var self = this;

			// 创建底层容器
			var el = this.$el = $('<div class="G-frame"/>').appendTo($(document.body));

			// 从服务器加载模版html文件
			util.loadTpl('framework.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 绑定按钮事件
				el.find('.buttons .login').on('click', self.eventLogin);
				el.find('.buttons .signUp').on('click', self.eventSignup);
				el.find('.G-frameHeaderLogo').on('click', self.eventBackHome);


				// 缓存dom元素
				core._.frame = el.find('.G-frameBody');

				// 加载完成，执行回调，返回上一级
				callback();
			});
		},
		eventBackHome: function(ev){
			window.location.hash = "#post";
		},
		eventLogin: function(ev){
			console.log(arguments);
		},
		eventSignup: function(ev){
			window.location.hash = "#user";
		}
	}
	exports.base = Frame;
	

});
