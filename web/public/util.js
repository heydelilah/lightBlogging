define(function(require, exports){

	var $ = require('jquery');

	exports.count = function(a, b){
		return a+b;
	}

	function isString(str){
		return (typeof(str) === 'string');
	}
	exports.isString = isString;

	function ucFirst(str){
		if (isString(str)){
			var c = str.charAt(0).toUpperCase();
			return c + str.substr(1);
		}
		return str;
	}
	exports.ucFirst = ucFirst;

	function isFunc(func){
		return (func instanceof Function);
	}
	exports.isFunc = isFunc;


	// 加载html模版
	function loadTpl(uri, callback){

		// 请求数据
		$.ajax({
			url: "core/template",
			data: {"uri": uri},
			context: document.body
		}).done(function(data) {

			// 回调函数
			callback(data);

		}).fail(function() {
			alert( "加载html模版失败" );
		});


	}
	exports.loadTpl = loadTpl;


	function timeFormat (millisec, format) {
		var self = new Date();
		self.setTime(millisec);

		var date = {
			"M+": self.getMonth() + 1,
			"d+": self.getDate(),
			"h+": self.getHours(),
			"m+": self.getMinutes(),
			"s+": self.getSeconds(),
			"q+": Math.floor((self.getMonth() + 3) / 3),
			"S+": self.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (self.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
		return format;
	}
	exports.timeFormat = timeFormat;
// var d = new Date().format('yyyy-MM-dd');
});