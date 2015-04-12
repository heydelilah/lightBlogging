define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var core = require('core');

	// 注册
	var Signup = {
		init: function(config){

			var self = this;

			var c = this.$config = config;

			// 创建底层容器
			var el = this.$el = $('<div class="P-user" />').appendTo(c.target);

			// 从服务器加载模版html文件
			util.loadTpl('user/signup.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 监听按钮点击事件
				el.find('.save').on('click', self.eventSave.bind(self));
				el.find('.back').on('click', self.eventBack);

			});
			
		},
		eventSave: function(ev){

			var data = this.getData();

			// 请求数据
			$.ajax({
				url: "user/create",
				data: data,
				type: "POST",
				context: document.body
			}).done(this.onSave.bind(this)).fail(function() {
				alert( "add user failed" );
			});

		},
		eventBack: function(ev){
			window.location.hash = "#post"
		},
		onSave: function(){
			window.location.hash = "#post";
		},
		getData: function(){
			var el = this.$el;
			return {
				'Name': el.find('.Name').val(),
				'Email': el.find('.email').val(),
				'Password': el.find('.password').val(),
			}
		},
		reset: function(){
			var el = this.$el;
			el.find('.name').val('');
			el.find('.email').val('');
			el.find('.password').val('');
		}

	};
	exports.signup = Signup;

	// 登陆
	var Login = {
		init: function(config){

			var self = this;

			var c = this.$config = config;

			// 创建底层容器
			var el = this.$el = $('<div class="P-userLogin" />').appendTo(c.target);

			// 从服务器加载模版html文件
			util.loadTpl('user/login.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 监听按钮点击事件
				el.find('.save').on('click', self.eventSave.bind(self));

				// 测试登入
				el.find('.member').click(self.eventTest.bind(self, 'member'));
				el.find('.admin').click(self.eventTest.bind(self, 'admin'));

			});
			
		},
		// 仅为了方便测试
		eventTest: function(type, ev){
			var data = null;
			switch(type){
				case 'member':
					data = {
						'Email': 'delilah@mail.com',
						'Password': 123
					};
				break;
				case 'admin':
					data = {
						'Email': 'jing@mail.com',
						'Password': 123
					};
				break;
			}
			this.save(data);
		},
		eventSave: function(ev){

			var data = this.getData();
			this.save(data);
		},
		save: function(data){
			// 请求数据
			$.ajax({
				url: "user/login",
				data: data,
				type: "POST",
				context: document.body
			}).done(this.onSave.bind(this)).fail(function() {
				alert( "add user failed" );
			});
		},
		onSave: function(result){
			if(result.error){
				alert(result.error);
				return;
			}
			core.updateUserInfo(result[0]);
			window.location.hash = "#post";
		},
		getData: function(){
			var el = this.$el;
			return {
				'Email': el.find('.email').val(),
				'Password': el.find('.password').val()
			}
		},
		reset: function(){
			var el = this.$el;
			el.find('.email').val('');
			el.find('.password').val('');
		}
	};
	exports.login = Login;

	var Loginout = {};

	// 忘记密码 －@todo

});