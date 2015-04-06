var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
var mongodb = require('mongodb');

// 数据库
var db = null;

// 核心
var Core = {
	// 计数器 －与数据库同步
	$counter: {
		post: 0,
		user: 0,
		comment: 0,
		channel: 0,
		tag: 0
	},

	// 启动
	start: function(response){

		// 启动数据库
		this.connectDB(response);

	},
	// 连接数据库
	connectDB: function(response){

		var self = this;

		var MongoClient = mongodb.MongoClient;

		MongoClient.connect("mongodb://localhost:27017/blog", function(err, database) {

			// 保存在全局变量中
			db = database;

			if(!err) {

				self.syncCounter(response);

			}else{
				self.failed(response);
			}
		});
	},
	// 连接成功
	success: function(response){
		var file = fs.readFileSync('index.html');
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file);
		response.end();
	},
	// 连接失败
	failed: function(response){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('Connent mongodb failed !');
		response.end();
	},
	// 同步计数器
	syncCounter: function(response){
		var self = this;

		var collection = db.collection('counter');
		collection.find().toArray(function(err, items) {
			
			if(!err){
				console.log(items);

				var data = items[0];

				self.$counter = {
					'user': data.user,
					'post': data.post,
					'comment': data.comment,
					'channel': data.channel,
					'tag': data.tag
				};

				self.success(response);

			}else{
				self.failed(response);
			}
		});
	},

	// 更新计数器
	updateCounter: function(name){
		var now = ++this.$counter[name];

		var param = {};
		param[name] = now;

		var collection = db.collection('counter');
		collection.update({'id': 0}, {$set: param});			

	},

	// 返回模版数据
	template: function(response, request){
		// 请求参数
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var file = fs.readFileSync('web/template/'+param.uri);

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file);
		response.end()		
	}
};
exports.core = Core;


// 文章
var Post = {

	// 获取post的全部数据
	list: function(response){
		if(db){
			var collection = db.collection('post');

			collection.find().toArray(function(err, items) {

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

			collection.find({'Id': +param.Id}).toArray(function(err, items) {

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
					
					// 自增
					Core.updateCounter('post');
					
					collection.insert({
						'Id': Core.$counter.post,				
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
					response.write(JSON.stringify({"Id": Core.$counter.post}));
					response.end();
				});
			}
		}
	}
}
exports.post = Post;

// 评论
var Comment = {
	// 获取某个文章下的所有评论
	list: function(response, request){
		if (request.method == 'GET'){
			var arg = url.parse(request.url).query;
			var param = querystring.parse(arg);
		}

		if(db){
			var cm = db.collection('comment');

			// @todo 要取到用户的信息

			cm.find({'PostId': +param.Id}).toArray(function(err, cmData) {

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
var User = {
	// 添加用户
	create: function(response, request){
		var self = this;

		if (request.method == 'GET'){
			var arg = url.parse(request.url).query;
			var data = querystring.parse(arg);
		}
		if (request.method == 'POST'){
			var body = '';

			request.on('data', function (data) {
				body += data;
			});

			request.on('end', function () {
				var data = querystring.parse(body);

				Core.updateCounter('user');

				var collection = db.collection('user');
				collection.insert({
					'Id': Core.$counter.user,				// 自增
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
				response.write(JSON.stringify({"Id": Core.$counter.user}));
				response.end();
			});
		}
		
	}
};
exports.user = User;


