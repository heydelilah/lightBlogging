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

				var id = config.param;
				self.load(id);
				self.buildCommentForm(id);
				self.buildCommentList(id);
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

			this.buildCommentList(param);
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

					target.find('.pencilEdit').click(self.eventEdit.bind(self, data));
					target.find('.archive').click(self.eventArchive.bind(self, data));

				});
			}else{
				target.append(c.tplPost(data));
			}
		},
		eventEdit: function(data, ev){
			window.location.hash = "#post/edit/"+data.Id;
		},
		eventArchive: function(data, ev){
			var result = confirm('确定要删除此文章吗？');
			if(result){
				this.archive(data.Id);
			}
		},
		// 归档文章
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
			window.location.hash = '#post';
		},
		buildCommentForm: function(id){
			var el = this.$el;

			comment.form.init({
				target: el.find('.P-postDetailCommentForm'),
				postId: id
			});
		},
		buildCommentList: function(id){
			comment.list.init({
				target: this.$el.find('.P-postDetailCommentList'),
				postId: id
			});
		},
		addComment: function(data){
			var date = new Date();
			data['CreateTime'] = date.getTime();
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
