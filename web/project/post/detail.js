define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');
	var editor = require('kindeditor');

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

			// 加载评论数据
			$.ajax({
				url: "comment/list",
				data: {'Id': param},
				context: document.body
			}).done(function(data) {

				self.buildComment(data);

			}).fail(function() {
				alert( "load post data failed" );
			});
		},
		reload: function(param){
			this.$el.find('.P-postDetailContent').empty();
			this.$el.find('.P-postDetailComment .displayArea').empty();

			this.load(param);
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


					// 编辑器
					var option = {
						basePath: 'web/libs/kindeditor/',
						items:[
							'source', 'code', '|', 'justifyleft', 'justifycenter', 'justifyright',
							'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
							'superscript',  '|',							'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
							'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
							'flash', 'media', 'table', 'hr', 'emoticons'
						]
					};

					self.$editor = KindEditor.create('#editorComment', option);

				});
			}else{
				target.append(c.tplPost(data));
			}
		},
		buildComment: function(data){
			var c = this.$config;

			var target = this.$el.find('.P-postDetailComment .displayArea');

			var i = null;
			if(!c.tplComment){

				util.loadTpl('comment/comment.html', function(file){

					// 使用 handlebars 解析
					var template = c['tplComment'] = Handlebars.compile(file);

					for (i = 0; i < data.length; i++) {

						var dom = template(data[i]);

						// 插入到浏览器页面
						target.append(dom);
					};
				});
			}else{
				// target.append(c.tplComment(data));

				for (i = 0; i < data.length; i++) {

					target.append(c.tplComment(data[i]));
				};

			}
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
