define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var editor = require('kindeditor');
	var handlebars = require('handlebars');


	// 详情页
	var Edit = {
		init: function(config){
			var self = this;

			// 创建底层容器
			var el = this.$el = $('<div class="P-postEdit"/>').appendTo(config.target);

			// 从服务器加载模版html文件
			var self = this;
			util.loadTpl('post/edit.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template()

				// 插入到浏览器页面
				el.append(dom);

				// 编辑器
				var option = {
					basePath: 'web/libs/kindeditor/',
				}

				self.$editor = KindEditor.create('#editorPost', option);

				// 绑定按钮点击事件
				el.find('.save').on('click', self, self.eventSave);
				el.find('.cancel').on('click', self, self.eventCancel);

				var id = config.param;
				if(id){
					self.load(id);
				}
			});
		},
		load: function(id){
			var self = this;

			// 加载文章数据
			$.ajax({
				url: "post/info",
				data: {'Id': id},
				context: document.body
			}).done(function(data) {

				self.setData(data[0]);

			}).fail(function() {
				alert( "load post data failed" );
			});

		},
		setData: function(data){
			var el = this.$el;
			this.$id = data.Id;
			el.find('.title').val(data.Title);
			el.find('.channel').val(data.Channel);
			this.$editor.html(data.Content);
			el.find('.tag').val(data.Tag);
		},
		eventSave: function(ev){
			var self = ev.data;

			var data = self.getData();

			if(!self.validate(data)){
				return false;
			}

			self.save(data);
		},
		save: function(data){
			var url = this.$id ? "post/update" : "post/create";

			$.ajax({
				url: url,
				data: data,
				type: "POST",
				context: document.body
			}).done(this.onSave).fail(function() {
				alert( "create post failed" );
			});
		},
		onSave: function(data){
			console.log('save done');
			window.location.hash = '#post';
		},
		getData: function(){
			var el = this.$el;

			var data = {
				'Title': el.find('.title').val(),
				'Channel': el.find('.channel').val() || 1,
				'Content': this.$editor.html(),
				'Tag': el.find('.tag').val() || 1
			};

			if(this.$id){
				data.Id = this.$id;
			}

			return data;
		},
		validate: function(data){
			if(!data.Title){
				alert('请输入文章标题');
				return false;
			}

			if(!data.Content){
				alert('请输入文章内容');
				return false;
			}


			return true;
		},
		eventCancel: function(ev){
			window.location.hash = "#post";
		},
		reset: function(){
			var el = this.$el;

			this.$id = 0;

			el.find('.title').val('');
			el.find('.channel').val('');
			this.$editor.html('');
			el.find('.tag').val('');
		}
	}
	exports.base = Edit;
	
});
