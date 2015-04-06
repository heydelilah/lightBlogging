var http = require('http');
var url = require('url');

function start(route){
	function onRequest(request, response){

		var pathname = url.parse(request.url).pathname;

		route(pathname, response, request);
	}

	http.createServer(onRequest).listen(8599);
}

exports.start = start;