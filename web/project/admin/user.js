define(function(require, exports){
	var util = require('util');
	var $ = require('jquery');

	var Main = function(){

		var data = {
			id:1,
			name: 'lily'
		};

		// 请求数据
		$.ajax({
			url: "addUser",
			data: data,
			context: document.body
		}).done(function(data) {
			console.log(data)
		}).fail(function() {
			alert( "error~" );
		});
	}
	exports.base = Main;

});