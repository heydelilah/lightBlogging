define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');

	// 数据映射表
	var MAPPING = {
		userId: {
			1 : 'Delilah'
		},
		tag: {
			1 : 'luoo'
		},
		channel: {
			1: 'Music'
		}
	};

	var Home = {
		init: function(config){


			// this.$config = config;

			
			var self = this;

			// 创建底层容器
			var el = this.$el = $('<div class="P-home"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			util.loadTpl('home.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 绑定按钮事件
				el.find('.buttons .add').on('click', self.eventAddPost);


				// 请求数据
				$.ajax({
					url: "post/list",
					context: document.body
				}).done(function(data) {

					for (var i = 0; i < data.length; i++) {
						if(data[i].content){
							self.createPost(data[i]);
						}
					};
				}).fail(function() {
					alert( "load post data failed" );
				});
			});


		},
		eventAddPost: function(ev){
			console.log('add post');
		},
		getContainer: function(){
			return this.$doms;
		},
		// 创建文章
		createPost: function(data){
			var target = this.$el.find('.post');

			data = this.tranData(data);

			// 从服务器加载模版html文件
			util.loadTpl('article.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template(data)

				// 插入到浏览器页面
				target.append(dom);
			});
		},
		tranData: function(data){
			for(var name in data){
				var config = MAPPING[name];
				if(config){
					data[name] = config[ data[name] ];

				}
				if(name == 'createTime'){
					data[name] = util.timeFormat(data[name], 'YYYY-MM-dd h:m:s');
				}
			}
			return data;
		}
	}
	exports.base = Home;
	
});
