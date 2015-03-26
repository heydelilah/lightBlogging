define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');

	// 新增用户
	var AddUser = function(){
		// 界面
		var dom = $([
			'<div>Add user</div>',
			'<div><label>姓名：</label><input type="text" class="name"></div>',
			'<div><label>邮箱：</label><input type="text" class="email"></div>',
			'<div><label>密码：</label><input type="text" class="password"></div>',
			'<div><input type="button" value="save" class="save"></div>'
		].join('')).appendTo(document.body);

		// 监听点击事件
		dom.find('.save').on('click', function(ev){

			// getData()
			var data = {
				'Name': dom.find('.name').val(),
				'Email': dom.find('.email').val(),
				'Password': dom.find('.password').val()
			};

			// 请求数据
			$.ajax({
				url: "addUser",
				data: data,
				type: "POST",
				context: document.body
			}).done(function(data) {
				console.log(data)
			}).fail(function() {
				alert( "add user failed" );
			});
		});

	}
	exports.base = AddUser;

});