define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var core = require('core');
	var CryptoJS = require('md5');
	var handlebars = require('handlebars')

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
				var template = handlebars.compile(file);
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

			// 表单验证
			if(!this.validate(data)){
				return;
			}

			// 密码加密
			var code = CryptoJS.MD5(data.Password).toString();
			data.Password = code;

			// 请求数据
			$.ajax({
				url: "user/create",
				data: data,
				type: "POST",
				context: document.body
			}).done(this.onSave.bind(this)).fail(function() {
				console.log(arguments)
				alert( "add user failed" );
			});

		},
		validate: function(data){
			// 两次密码应相等
			if(data.Password !== data.PasswordVerify){
				alert("两次输入的密码不相等");
				return false;
			}
			return true;
		},
		eventBack: function(ev){
			window.location.hash = "#post"
		},
		onSave: function(result){
			if(result.err){
				alert(result.err);
				return false;
			}

			// @todo 以当前用户登录

			window.location.hash = "#post";
		},
		getData: function(){
			var el = this.$el;
			return {
				'Name': el.find('.name').val(),
				'Email': el.find('.email').val(),
				'Password': el.find('.password').val(),
				'PasswordVerify': el.find('.verify').val()
			}
		},
		reset: function(){
			var el = this.$el;
			el.find('.name').val('');
			el.find('.email').val('');
			el.find('.password').val('');
			el.find('.verify').val('');
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
				var template = handlebars.compile(file);
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
						'Password': '123'
					};
				break;
				case 'admin':
					data = {
						'Email': 'jing@mail.com',
						'Password': '123'
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
			// 密码加密
			var salt = Math.random().toString();
			var codem5 = CryptoJS.MD5(data.Password).toString();
			var code = CryptoJS.MD5(codem5+salt).toString();
			data.Password = code;
			data.Salt = salt;

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

	// var Loginout = {};

	// 忘记密码 －@todo

});