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
			
			var self = this;

			this.$config = config;

			// 创建底层容器
			var el = this.$el = $('<div class="P-postList"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			util.loadTpl('post/main.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 绑定按钮事件
				el.find('.P-postListButtons .add').on('click', self.eventAddPost);

				// 请求数据
				self.load();
			});
		},
		load: function(){
			$.ajax({
				url: "post/list",
				context: document.body
			}).done(this.onData.bind(this)).fail(function() {
				alert( "load post data failed" );
			});
		},
		onData: function(data){
			var self = this;
			
			util.loadTpl('post/article.html', function(file){
				var template = Handlebars.compile(file);
				
				// 创建文章
				for (var i = 0; i < data.length; i++) {

					var value = self.tranData(data[i]);

					article = template(value);

					self.$el.find('.P-postListContent').append(article);
				};

				// 绑定事件
				self.$el.find('.pencilEdit').click(self.eventGoEdit);
				self.$el.find('.showAll').click(self.eventShowAll);
			});
		},
		eventShowAll: function(ev){
			$(this).toggleClass('act');
			$(this).siblings('.post').toggleClass('act');
		},
		// 点击铅笔进入编辑页
		eventGoEdit: function(ev){
			var id = $(this).attr('data-id');
			window.location.hash = '#post/edit/'+id;
		},
		eventAddPost: function(ev){
			window.location.hash = "#post/edit";
		},
		getContainer: function(){
			return this.$doms;
		},
		reload: function(){
			this.$el.find('.P-postListContent').empty();
			this.load();
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
