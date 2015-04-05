define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');

	// 新增用户
	var AddUser = {
		init: function(config){

			var self = this;

			var c = this.$config = config;

			// 创建底层容器
			var el = this.$el = $('<div class="P-user" />').appendTo(c.target);

			// 从服务器加载模版html文件
			util.loadTpl('signup.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 监听按钮点击事件
				el.find('.save').on('click', self.eventSave);
				el.find('.back').on('click', self.eventBack);

			});
			
		},
		eventSave: function(ev){
			// getData()
			var data = {
				'Name': dom.find('.name').val(),
				'Email': dom.find('.email').val(),
				'Password': dom.find('.password').val()
			};

			// 请求数据
			$.ajax({
				url: "addUser",
				data: data,
				type: "POST",
				context: document.body
			}).done(function(data) {
				console.log(data)
			}).fail(function() {
				alert( "add user failed" );
			});

		},
		eventBack: function(ev){
			window.location.hash = "#home"
		}

	}
	exports.base = AddUser;

});