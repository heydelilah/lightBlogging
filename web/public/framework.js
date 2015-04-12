define(function(require, exports){
	var $ = require('jquery');
	var util = require('util');
	var core = require('core');
	var handlebars = require('handlebars');

	// 全局框架
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

				// 绑定点击事件
				el.find('.G-frameHeaderLogo').on('click', self.eventBackHome);
				el.find('.logout').on('click', self.eventLogout);


				// 加载完成，执行回调，返回上一级
				callback();

				// 更新用户信息
				if(config.userInfo){
					self.updateHeader(config.userInfo);	
				}
			});
		},
		getDOM: function(){
			return this.$el.find('.G-frameBody');
		},
		// 返回主页
		eventBackHome: function(ev){
			window.location.hash = "#post";
		},
		// 退出登录
		eventLogout: function(ev){
			var result = confirm('确认退出登录吗？');
			if(result){
				$.ajax({
					url: "user/logout",
					context: document.body
				}).done(function(){
					alert('已成功退出。')
					window.location.hash = "#post";
				});
			}
		},
		// 更新头部用户信息栏
		updateHeader: function(data){
			var el = this.$el;

			var btns = el.find('.buttons');
			var info = el.find('.userInfo');

			if(data){
				info.show();
				btns.hide();
				info.find('.name').text(data.Name);
			}else{
				btns.show();
				info.hide();
			}
		}
	}
	exports.base = Frame;
	

});
