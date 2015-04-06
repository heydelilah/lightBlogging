define(function(require, exports){
	var $ = require('jquery');

	// 切换场景
	function changeScene(name){
		var html = global.frame;

		var cons = html.find('.G-frameContainer');
		cons.hide();

		var elm = html.find('div[data-type="'+name+'"]');
		if(elm && elm.length){
			elm.show();
			return;
		}
	}
	exports.changeScene = changeScene;

	/**
	 * 创建模块
	 * 1切容器； 2 引入模块，并执行
	 * @param  {String}	标识名字	
	 * @param  {String}	模块的文件地址	
	 * @param  {Object}	参数，可选
	 * @param  {Function}	回调函数，可选
	 * @return {null}
	 */
	function create(name, uri, param, callback){

		// 处理非必填参数
		if(!callback && typeof param == 'function'){
			callback = param;
		}

		// 如果没有指明，一律执行切容器
		if(name != 'frame'){
			changeScene(name);
		}


		var url = window.ROOT(uri);
		var type = url;
		var pos = type.lastIndexOf('.');
		var uri;
		if (pos !== -1){
			uri = type.substr(0, pos);
			type = type.substr(pos + 1);
		}else {
			uri = type;
			type = null;
		}


		// 加载文件
		require.async(uri, function(mod){

			// 如果没有指明容器，全部放在框架的body中
			var target = null;
			if(name == 'frame'){
				target = $(document.body);
			}else{
				target = $('<div data-type="'+name+'" class="G-frameContainer" />');
				target.appendTo(global.frame);
			}

			// 合并参数
			var initConfig = $.extend({
				"target": target
			},param);

			// 执行函数 -init
			mod = mod[type];
			mod.init(initConfig, function(){

				// 执行回调函数
				if(callback){
					callback();
				}
			});

			// 新建实例，保存在全局变量中
			global[name] = mod;
		});
	}
	exports.create = create;


	// 全局变量
	var global = exports._ = {};

	exports.get = function(name){
		return global[name] || null;
	};

});