var server = require('./server');
var router = require('./route');
var requestHandlers = require('./requestHandlers');

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;

handle["/blogData"] = requestHandlers.blogData;

server.start(router.route, handle);