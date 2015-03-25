文件目录
==========================
server -后端
web -前端
	controller -业务模块入口
	project	-业务模块
	public -核心框架
		core.js	-核心
		router.js -路由
		util.js -工具库
	modules -公用组件
	libs -第三方库
	init.js -入口


seajs配置
========================
alias: {
	"jquery":		"@libs/jquery/jquery-1.8.3.min.js",
	"router":		ROOT("web/public/router"),
	"util":			ROOT("web/public/util"),
	"core":			ROOT("web/public/core")
},
paths: {
	"@libs":		ROOT("web/libs")
}



路由
=====================
路由启动
router.start();

本质
监听Hash变化 -hashChanged()
根据不同hash值，加载controller文件夹下的不同业务入口模块


附录
======================
@20150325
