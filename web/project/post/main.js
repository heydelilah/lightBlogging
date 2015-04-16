define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');
	var core = require('core');

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

			// 如果非游客，要显示添加文章按钮
			var user = core.getUser();
			var className = user.Id ? '': 'P-postListVisitor';

			// 创建底层容器
			var el = this.$el = $('<div class="P-postList '+className+'"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			util.loadTpl('post/main.html', function(file){

				var template = handlebars.compile(file);
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
				var template = handlebars.compile(file);

				var user = core.getUser();

				// 创建文章
				for (var i = 0; i < data.length; i++) {

					var value = self.tranData(data[i]);

					// 是否是发布者本人
					var isAuthor = (value.UserId == user.Id) ? '':'is-hidden';
					// 是否是管理员 -管理员永远有权限查看
					var isAdmin = (value.Role == 'admin') ? '':isAuthor;

					value["Right"] = isAdmin;


					var article = template(value);

					self.$el.find('.P-postListContent').append(article);
				}

				// 绑定事件
				self.$el.find('.pencilEdit').click(self.eventGoEdit);
				self.$el.find('.archive').click(self.eventArchive.bind(self));
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
		// 归档
		eventArchive: function(ev){
			var id = $(ev.target).attr('data-id');
			var result = confirm('确定要删除此文章吗？');
			if(result){
				this.archive(id);
			}
		},
		eventAddPost: function(ev){
			window.location.hash = "#post/edit";
		},
		getContainer: function(){
			return this.$doms;
		},
		archive: function(id){
			$.ajax({
				url: "post/remove",
				data: {'Id': id},
				context: document.body
			}).done(this.onArchive.bind(this)).fail(function() {
				alert( "删除文章失败" );
			});
		},
		onArchive: function(){
			// @todo 更新页面
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
				if(name == 'CreateTime'){
					data[name] = util.timeFormat(data[name], 'YYYY-MM-dd h:m:s');
				}
			}
			return data;
		}
	}
	exports.base = Home;

});
