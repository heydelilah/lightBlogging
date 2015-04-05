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

			this.$el = $('<div class="P-home"/>').appendTo(config.target);


			// 请求数据
			$.ajax({
				url: "getPostData",
				context: document.body
			}).done(function(data) {
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					if(data[i].content){
						self.createPost(data[i]);
					}
				};
			}).fail(function() {
				alert( "add user failed" );
			});

		},
		getContainer: function(){
			return this.$doms;
		},
		// 创建文章
		createPost: function(data){
			var self = this;

			data = this.tranData(data);

			// 从服务器加载模版html文件
			util.loadTpl('home.html', function(file){

				// 使用 handlebars 解析
				var template = Handlebars.compile(file);
				var dom = template(data)

				// 插入到浏览器页面
				self.$el.append(dom);
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
