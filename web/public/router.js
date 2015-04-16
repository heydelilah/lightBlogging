// 启动模块定义(路由模块)
define(function(require, exports){
	var Win = window,
		Loc = Win.location,
		Doc = Win.document,
		URL = Loc.href,
		app = null,
		// tpl = null,
		routers = [
			/^[^#]+#([^\/?]+)?(?:\/([^\/?]+))?(?:\/([^?]+))?(?:\?(.+))?$/
		];

	var util = require('util');

	// 定义路由操作状态
	var env = exports.env = {
		login: null,
		module: null,
		action: null,
		param: null,
		search: null,
		current: null,
		wait_template: false
	};


	/**
	 * 参数格式化
	 * @param  {String} search 附加参数字符串
	 * @return {Object}        格式化完的附加参数对象
	 * @preserve
	 */
	function _formatSearch(search){
		search = search.split("&");
		var p = {};
		for(var i =0;i<search.length;i++){
			search[i] = search[i].split("=");
			p[search[i].shift()] = search[i].join('=');
		}
		return p;
	}



	// 监听Hash变化事件
	function hashChanged(){
		URL = Loc.href;
		var res;
		for (var i=0; i<routers.length; i++){
			if (typeof routers[i] == 'function'){
				res = routers[i](URL);
			}else if (routers[i] instanceof RegExp){
				res = routers[i].exec(URL);
				if (res){
					res = {
						'module': res[1],
						'action': res[2],
						'param': res[3],
						'search': res[4]
					};
				}
			}
			if (res){
				break;
			}
		}
		if (res){
			run(res.module, res.action, res.param, res.search);
		}else {
			run();
		}
	}


	// 定义无需登录检查的模块
	function run(module, action, param, search){
		var router = {
			default_module: 'post',
			default_action: 'main',
			login_module: 'login',
			login_action: 'main',
			publics: ['login', 'privacy']
		};

		env.module = module || router.default_module || 'default';
		env.action = action || router.default_action || 'main';
		env.param  = param || null;
		env.search = search || null;

		// 加载控制器
		var url = window.ROOT('web/controller/');
		require.async(url+env.module, onRun);
	}


	function onRun(mod){
		// 已经被运行过, 防止快速点击的时候重复运行
		if (!env.module || !env.action) {return false;}

		// 模块加载完成，检查方法是否有效，有效则调用
		var act = 'on' + util.ucFirst(env.action);
		if (!mod){
			console.log('Module is missing - ' + env.module + ':' + act + '()');
		}else {
			var now = {
				name: env.module.replace(/\//g, '') + util.ucFirst(env.action),
				module: env.module,
				action: env.action,
				param: env.param,
				search: env.search,
				method: act
			};

			env.current = [env.module, env.action, env.param, env.search];



			if (mod[act] && util.isFunc(mod[act])){

				// 处理附加seache参数
				if(now.search){
					now.search = _formatSearch(now.search);
				}

				// 调用指定动作
				mod[act](exports, now, app);

			}else {
				console.error('Action is invalid - ' + env.module + ':' + act + '()');
				// app.error('Action is invalid - ' + env.module + ':' + act + '()');
			}
			if (env.module == now.module && env.action == now.action && env.param == now.param){
				env.module = env.action = env.param = null;
			}
		}
	}

	exports.run = run;


	// 开始执行路由
	exports.start = function(){
		if (('onhashchange' in Win) && (Doc.documentMode === undefined || Doc.documentMode==8)){
			if (Win.addEventListener){
				Win.addEventListener('hashchange', hashChanged, false);
			}else if (Win.attachEvent){
				Win.attachEvent('onhashchange', hashChanged);
			}else {
				Win.onhashchange = hashChanged;
			}
		} else {
			setInterval(function(){
				if (URL != Loc.href){ hashChanged.call(Win); }
			}, 150);
		}

		// 强制运行一次
		hashChanged();

	}

	exports.setRouter = function(rules, append){
		if (append === true){
			if (rules instanceof Array){
				routers.unshift.apply(routers, rules);
			}else {
				routers.unshift(rules);
			}
		}else if (rules instanceof Array){
			routers = rules;
		}else {
			routers.unshift(rules);
		}
		return this;
	}

});