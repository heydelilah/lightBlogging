(function(Sea, Win, Doc){
	// 基本目录配置
	var path = Win.location.href.split('#').shift();
	var root = path;
	var router, jQuery;


	// 项目根目录修正
	function ROOT(path){
		if (root && path.charAt(0) != '/'){
			return root + path;
		}
		return path;
	}
	Win.ROOT = ROOT;

	// 返回SeaJS配置信息
	function sea_config(){
		return {
			alias: {
				"jquery":		"@libs/jquery/jquery-1.8.3.min.js",
				"router":		ROOT("web/public/router"),
				"util":			ROOT("web/public/util"),
				"core":			ROOT("web/public/core"),
				"handlebars": 	"@libs/handlebars-v3.0.0.js",
				"kindeditor":	"@libs/kindeditor/kindeditor-min.js",
				"md5":			"@libs/hmac-md5.js",
			},
			paths: {
				"@libs":		ROOT("web/libs")
			}
		};
	}


	// SeaJS全局配置
	Sea.config(sea_config());

	// 引入模块, 开始初始化
	Sea.use(['core', 'jquery', 'router'], function(core, $, router){

		// 检查登陆状态
		$.ajax({
			url: "user/logininfo",
			context: document.body
		}).done(function(data){
			if(data){
				core.setUser(data);
			}

			// 创建全局底层框架
			core.create('frame', 'web/public/framework.base', {userInfo: data}, function(){

				// 启动路由
				router.start();

			});
		});




	});


})(seajs, window, document);