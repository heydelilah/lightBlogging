var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
var mongodb = require('mongodb');
var db;

function start(response) {
	var file = fs.readFileSync('index.html');

	// 启动数据库
	connect();

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(file);
	response.end()
}
exports.start = start;

// 连接数据库
function connect(){
	// Retrieve
	var MongoClient = mongodb.MongoClient;

	MongoClient.connect("mongodb://localhost:27017/blog", function(err, database) {
		if(!err) {

			// 赋予全局变量
			db = database;

			console.log("connect mongodb succeed");
		}else{
			console.log('connect mongodb failed');
		}
	});
}


// 获取post的全部数据
function getPostData(response) {
	if(db){
		var collection = db.collection('post');

		collection.find().toArray(function(err, items) {
			// console.log(items);
			var data = JSON.stringify(items);

			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(data);
			response.end();

		});

	}
}
exports.getPostData = getPostData;

var IdCounter = 0;

// 添加用户
function addUser(response, request){
	if(db){
		console.log(request.url)
		if (request.method == 'GET'){
			var arg = url.parse(request.url).query;
			var data = querystring.parse(arg);
			console.log(data)
		}
		if (request.method == 'POST'){
			var body = '';

			request.on('data', function (data) {
				body += data;
			});

			request.on('end', function () {
				var data = querystring.parse(body);
				console.log(data)

				var collection = db.collection('user');
				IdCounter++;
				collection.insert({
					'Id': IdCounter,				// 自增
					'Name': data.Name || '',
					'Email': data.Email || '',
					'Password': data.Password || 0,	// @todo 加密
					'Rights': data.Rights || [],
					'Role': data.Role || 0,
					'RegisterTime': data.RegisterTime || '',	// @todo 当前时间
					'LoginTime': data.LoginTime || ''
				}, {w: 1}, function(err, records){
					console.log("Record added as "+records[0]);
				});

				// 假设都是成功的
				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(JSON.stringify({"Id": IdCounter}));
				response.end();
			});
		}


	}
}
exports.addUser = addUser;


// 返回模版数据
function loadTpl(response, request){

	// 请求参数
	var arg = url.parse(request.url).query;
	var param = querystring.parse(arg);
	console.log(param)

	var file = fs.readFileSync('web/template/'+param.uri);


	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(file);
	response.end()
}
exports.loadTpl = loadTpl;