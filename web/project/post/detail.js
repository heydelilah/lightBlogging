define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');
	var editor = require('kindeditor');

	var comment = require('../comment');
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


	// 详情页
	var Detail = {
		init: function(config){
			this.$config = config;

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
				
				self.buildComment(config.param);
			});


		},
		// 请求数据
		load: function(param){
			var self = this;

			// 加载文章数据
			$.ajax({
				url: "post/info",
				data: {'Id': param},
				context: document.body
			}).done(function(data) {

				self.buildPost(data[0]);

			}).fail(function() {
				alert( "load post data failed" );
			});

		},
		reload: function(param){
			this.$el.find('.P-postDetailContent').empty();
			this.$el.find('.P-postDetailCommentList').empty();

			this.load(param);

			this.buildComment(param);
		},
		buildPost: function(data){
			var c = this.$config;

			var target = this.$el.find('.P-postDetailContent');

			data = this.tranData(data);

			if(!c.tplPost){

				// 从服务器加载模版html文件
				var self = this;
				util.loadTpl('post/article.html', function(file){

					// 使用 handlebars 解析
					var template = c['tplPost'] = Handlebars.compile(file);
					var dom = template(data)

					// 插入到浏览器页面
					target.append(dom);

				});
			}else{
				target.append(c.tplPost(data));
			}
		},
		buildComment: function(id){
			var el = this.$el;

			comment.form.init({
				target: el.find('.P-postDetailCommentForm'),
				postId: id
			});

			comment.list.init({
				target: el.find('.P-postDetailCommentList'),
				postId: id
			});

		},
		addComment: function(data){
			comment.list.buildItem(data);
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
	exports.base = Detail;
	
});
