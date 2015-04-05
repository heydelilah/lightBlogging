var fs = require('fs');

var requestHandlers = require('./requestHandlers');

// 类型映射表
var TYPES = {
	'png': 'image/png',
	'gif': 'image/gif',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'json': 'application/json',
	'js': 'application/x-javascript; charset=utf-8',
	'css': 'text/css',
	'html': 'text/html; charset=utf-8',
	'htm': 'text/html; charset=utf-8',
	'ico': 'image/x-icon',
	'svg': 'image/svg+xml'
};

function route (pathname, response, request) {
	// 定义路由规则
	// 第一个为实例对象，第二个为函数方法
	var result = pathname.match(/[A-z]+/g);

	if (result == null || !result.length) {
		result = ['core', 'start'];
	}


	// 模块名
	var modName = result[0];
	// 函数名
	var funcName = result[1];

	var module = requestHandlers[modName];


	if(module && typeof module[funcName] === 'function'){
		module[funcName](response, request);

	}else {

		// 去掉第一个\
		pathname = pathname.replace('\/','');
		// 如果是web下的文件，直接返回
		if(pathname.match('web/')){

			console.log("Local file: " + pathname);

			var ext = pathname.split('.');
			ext = ext.length > 1 ? ext.pop().toLowerCase() : '';
			var file = fs.readFileSync(pathname);

			response.writeHead(200, {'Content-Type': TYPES[ext]});
			response.write(file);
			response.end()

		}else{
			console.log("No request handler found for " + pathname);
			// 404文件没找到
			response.writeHead(404, 'FILE NOT FOUND');
			response.end('FILE_WAS_GONE');
		}

	}
}

exports.route = route;