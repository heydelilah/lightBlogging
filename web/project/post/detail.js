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


	// 详情页
	var Detail = {
		init: function(config){
			var self = this;

			// 创建底层容器
			var el = this.$el = $('<div class="P-postDetail"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			var self = this;
			util.loadTpl('post/detail.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template()

				// 插入到浏览器页面
				el.append(dom);

				self.load(config.param);
			});


		},
		// 请求数据
		load: function(param){
			var self = this;

			// 加载文章数据
			$.ajax({
				url: "post/info",
				data: {'id': param},
				context: document.body
			}).done(function(data) {

				self.buildPost(data[0]);

			}).fail(function() {
				alert( "load post data failed" );
			});

			// 加载评论数据
			$.ajax({
				url: "comment/list",
				data: {'id': param},
				context: document.body
			}).done(function(data) {

				self.buildComment(data);

			}).fail(function() {
				alert( "load post data failed" );
			});
		},
		buildPost: function(data){
			var target = this.$el.find('.P-postDetailContent');

			data = this.tranData(data);

			// 从服务器加载模版html文件
			var self = this;
			util.loadTpl('post/article.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template(data)

				// 插入到浏览器页面
				target.append(dom);
			});

		},
		buildComment: function(data){
			var target = this.$el.find('.P-postDetailComment .content');

			util.loadTpl('comment/comment.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);

				for (var i = 0; i < data.length; i++) {

					var dom = template(data[i]);

					// 插入到浏览器页面
					target.append(dom);
				};
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
	exports.base = Detail;
	
});
