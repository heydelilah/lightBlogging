var server = require('./server');
var router = require('./route');
var requestHandlers = require('./requestHandlers');

var handle = {}

// 主页
handle["/"] = requestHandlers.start;
handle["/home"] = requestHandlers.start;

// 注册
handle["/addUser"] = requestHandlers.addUser;


// 请求数据
handle["/getPostData"] = requestHandlers.getPostData;

// 请求加载静态模版－html文件
handle["/loadTpl"] = requestHandlers.loadTpl;

server.start(router.route, handle);