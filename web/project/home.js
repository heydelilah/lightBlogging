define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');
	var handlebars = require('handlebars');

	var Home = function(){
		
		var dom = $([
			'<div><input type="button" value="show" class="save"></div>'
		].join('')).appendTo(document.body);

		// 监听点击事件
		dom.find('.save').on('click', function(ev){

			// 请求数据
			$.ajax({
				url: "getPostData",
				// data: data,
				// type: "POST",
				context: document.body
			}).done(function(data) {
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					if(data[i].content){
						createPost(data[i]);
					}
				};
			}).fail(function() {
				alert( "add user failed" );
			});
		});
	}
	exports.base = Home;
	
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

	function tranData(data){
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

	// 创建文章
	function createPost(data){
		data = tranData(data);
		var el = $(document.body);

		// 从服务器加载模版html文件
		util.loadTpl('home.html', function(file){
			console.log(file)

			// 使用 handlebars 解析
			var template = Handlebars.compile(file);
			var dom = template(data)

			// var data = handlebars.compile(file)
			// 插入到浏览器页面
			el.append(dom);

			// $(dom).find('.post').append(data.content);

		});
		
	}




});
