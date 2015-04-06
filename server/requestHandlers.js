var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
var mongodb = require('mongodb');
var db;

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

// 核心
var Core = {
	start: function(response){
		var file = fs.readFileSync('index.html');

		// 启动数据库
		connect();

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file);
		response.end()
	},
	// 返回模版数据
	template: function(response, request){
		// 请求参数
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);
		console.log(param)

		var file = fs.readFileSync('web/template/'+param.uri);


		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file);
		response.end()		
	}

}
exports.core = Core;


// 文章
var Post = {

	// 全局自增id
	$counter: 0,

	// 获取post的全部数据
	list: function(response){
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
	},
	// 获取单条post数据
	info: function(response, request){
		if (request.method == 'GET'){
			var arg = url.parse(request.url).query;
			var param = querystring.parse(arg);
		}

		if(db){
			var collection = db.collection('post');

			collection.find({'id': +param.id}).toArray(function(err, items) {

				var data = JSON.stringify(items);

				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(data);
				response.end();
			});
		}
	},
	// 新建文章
	create: function(response, request){
		var self = this;
		if(db){
			if (request.method == 'POST'){
				var body = '';

				request.on('data', function (data) {
					body += data;
				});

				request.on('end', function () {
					var data = querystring.parse(body);

					var collection = db.collection('post');

					console.log(data);
					
					self.$counter++;
					
					collection.insert({
						'Id': self.$counter,				// 自增
						'Title': data.Title || '',
						'Content': data.Content || '',
						'Channel': data.Channel || 1,
						'Tag': data.Tag || 1,
						'CreateTime': 0,
						'UpdateTime': 0,
						'UserId': 1
					}, {w: 1}, function(err, records){
						console.log("Record added as "+records[0]);
					});

					// 假设都是成功的
					response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
					response.write(JSON.stringify({"Id": self.$counter}));
					response.end();
				});
			}
		}
	}
}
exports.post = Post;

// 评论
var Comment = {
	list: function(response, request){
		if (request.method == 'GET'){
			var arg = url.parse(request.url).query;
			var param = querystring.parse(arg);
		}

		if(db){
			var cm = db.collection('comment');
			// var user = db.collection('user');

			cm.find({'postId': +param.id}).toArray(function(err, cmData) {

				// for (var i = 0; i < cmData.length; i++) {
					
				// 	user.find({'id': +cmData[i].userId}).toArray(function(err, userData){
						
				// 		var value = userData[0];
				// 		console.log(userData)
				// 		if(value){
				// 			cmData[i].name = value.name;
				// 			cmData[i].email = value.email;
				// 		}
				// 	});

				// };

				var data = JSON.stringify(cmData);

				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(data);
				response.end();

			});
		}

	}
};
exports.comment = Comment;

// 用户
var IdCounter = 0;
var User = {
	// 添加用户
	create: function(response, request){
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
}
exports.user = User;


