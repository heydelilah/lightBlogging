define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');
	var editor = require('kindeditor');
	var core = require('core');


	// 留言－表单
	var CommentForm = {
		init: function(config){
			this.$config = config;

			// 创建底层容器
			this.$el = $('<div class="P-commentForm"/>').appendTo(config.target);

			this.build();
		},
		build: function(){
			var el = this.$el;
			
			// 从服务器加载模版html文件
			var self = this;
			util.loadTpl('comment/form.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template();

				// 插入到浏览器页面
				el.append(dom);

				// 编辑器
				var option = {
					basePath: 'web/libs/kindeditor/',
					items:[
						'code', '|', 'justifyleft', 'justifycenter', 'justifyright',
						'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
						'superscript',  '|','formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
						'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
						'flash', 'hr', 'emoticons'
					],
					resizeType: 0
				};

				self.$editor = KindEditor.create('#editorComment', option);

				el.find('.send').click(self.eventSend.bind(self));
			});
		},
		eventSend: function(ev){
			var data = this.getData();
			this.save(data);
		},
		save: function(data){
			$.ajax({
				url: "comment/create",
				data: data,
				type: 'POST',
				context: document.body
			}).done(this.onSave.bind(this, data)).fail(function() {
				console.log(arguments)
				alert( "add comment failed" );
			});
		},
		onSave: function(data, result, status){
			this.reset();
			
			// 界面上新增一条评论 @todo 优化
			core._.postDetail.addComment(data);
		},
		getData: function(){
			var el = this.$el;

			var user = core.getUser();
			var isVisitor = user.Role == 'visitor';

			return {
				'UserId': user.Id,
				'PostId': this.$config.postId,
				'Content': this.$editor.html(),
				'Name': isVisitor ? el.find('.name').val(): user.Name,
				'Email': isVisitor ? el.find('.email').val(): user.Email
			};
		},
		reset: function(){
			var el = this.$el;

			var isVisitor = core.getUser('Role') == 'visitor';
			if(isVisitor){
				el.find('.name').val('');
				el.find('.email').val('');
			}
			
			this.$editor.html('');
		}
	}
	exports.form = CommentForm;

	// 留言－展示
	var CommentList = {
		init: function(config){
			this.$config = config;

			// 创建底层容器
			this.$el = $('<div class="P-commentList"/>').appendTo(config.target);

			this.load(config.postId);

		},
		build: function(data){
			var c = this.$config;

			var target = this.$el;

			var self = this;

			util.loadTpl('comment/list.html', function(file){

				self.$template  = Handlebars.compile(file);

				for (var i = 0; i < data.length; i++) {

					self.buildItem(data[i]);

				};
			});
		
		},
		buildItem: function(data){

			data['CreateTime'] = util.timeFormat(data['CreateTime'], 'YYYY-MM-dd h:m:s');
			if(!data['Name']){
				data['Name'] = '游客'; // or "匿名用户"
			}
			var dom = this.$template(data);

			this.$el.append(dom);

		},
		// 加载评论数据
		load: function(id){
			$.ajax({
				url: "comment/list",
				data: {'Id': id},
				context: document.body
			}).done(this.onData.bind(this)).fail(function() {
				alert( "load post data failed" );
			});

		},
		onData: function(data){
			this.build(data);
		}
	};
	exports.list = CommentList;
	
});
