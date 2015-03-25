var fs = require('fs');

function route (handle, pathname, response, request) {
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		console.log("No request handler found for " + pathname);

		// 去掉第一个\
		pathname = pathname.replace('\/','');
		// 如果是js，直接返回
		if(pathname.match('web/')){
			var file = fs.readFileSync(pathname);
			response.writeHead(200, {'Content-Type': 'application/x-javascript'});
			response.write(file);
			response.end()

		}

	}
}

exports.route = route;