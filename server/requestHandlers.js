var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
var mongodb = require('mongodb');
var util = require('util');

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

	// 用户信息
	$user: {
		Id: 0,
		Name: '',
		Email: '',
		Role: 'visitor', // 游客，会员，管理员
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
		collection.update({'_id': 0}, {$set: param});

	},

	// 返回模版数据
	template: function(response, request){
		// 请求参数
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var file = fs.readFileSync('web/template/'+param.uri);

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file);
		response.end();
	}
};
exports.core = Core;


// 文章
var Post = {

	// 获取post的全部数据
	list: function(response){
		// 无请求参数

		var collection = db.collection('post');
		collection.find({'IsDelete': false}).toArray(function(err, items) {

			var data = JSON.stringify(items);

			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(data);
			response.end();

		});

	},
	// 获取单条post数据
	info: function(response, request){
		// GET
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var collection = db.collection('post');

		collection.find({'Id': +param.Id}).toArray(function(err, items) {
			var data = JSON.stringify(items);

			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(data);
			response.end();
		});
	},
	// 新建文章
	create: function(response, request){
		// 检查权限 -游客无发布文章权限
		if(!Core.$user.Id){
			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write("游客无权限");
			response.end();
			return;
		}


		// POST
		var body = '';
		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			var collection = db.collection('post');

			// 自增
			Core.updateCounter('post');

			console.log(Core.$user)

			var date = new Date();
			collection.insert({
				'Id': Core.$counter.post,
				'Title': data.Title || '',
				'Content': data.Content || '',
				'Channel': data.Channel || 1,
				'Tag': data.Tag || 1,
				'CreateTime': date.getTime(),
				'UpdateTime': date.getTime(),
				"IsDelete": false,
				// 冗余数据
				'UserId': Core.$user.Id || 1,
				'UserName': Core.$user.Name || ''

			}, {w: 1}, function(err, records){
				console.log("Record added as "+records[0]);
			});

			// 假设都是成功的
			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(JSON.stringify({"Id": Core.$counter.post}));
			response.end();
		});
	},
	// 更新文章
	update: function(response, request){
		// POST
		var body = '';

		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			var post = db.collection('post');

			// 无数据
			var result = post.find({'Id': +data.Id});
			if(!result){
				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(null);
				response.end();
				return;
			}
			// 无权限
			var hasRight = result.UserId == Core.$user.Id;
			if(!hasRight){
				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write("当前用户无权限");
				response.end();
				return;
			}

			var date = new Date();
			post.update({
				'Id': +data.Id
			},{ $set: {
				'Title': data.Title || '',
				'Content': data.Content || '',
				'Channel': data.Channel || 1,
				'Tag': data.Tag || 1,
				'UpdateTime': date.getTime(),
				"IsDelete": false
			}}, function(err, records){
				console.log(err);
				console.log(records);
			});

			// 假设都是成功的
			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(JSON.stringify(data));
			response.end();
		});
	},
	// 删除文章 -软删
	remove: function(response, request){
		// GET
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var collection = db.collection('post');
		collection.update(
			{
				'Id': +param.Id
			},
			{
				$set: {
					'IsDelete': true
				}
			}, function(err, records){
				console.log(err);
				console.log(records);
			}
		);

		// 假设都是成功的
		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(JSON.stringify('删除文章成功'));
		response.end();
	}
}
exports.post = Post;

// 评论
var Comment = {
	// 获取某个文章下的所有评论
	list: function(response, request){
		// GET
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var cm = db.collection('comment');

		cm.find({
			'PostId': +param.Id,
			'IsDelete': false
		}).toArray(function(err, cmData) {

			var data = JSON.stringify(cmData);

			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(data);
			response.end();

		});
	},
	// 新增评论
	create: function(response, request){

		// 自增
		Core.updateCounter('comment');

		// POST
		var body = '';

		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			// 当前登陆用户信息
			var user = Core.$user;
			var isVisitor = user.Role== 'visitor';

			// 当前时间
			var date = new Date();

			var cm = db.collection('comment');
			cm.insert({
				'Id': Core.$counter.comment,
				'PostId': +data.PostId,
				'UserId': +data.UserId,
				'Content': data.Content || '',
				'Name': isVisitor ? data.Name: user.Name,
				'Email': isVisitor ? data.Email: user.Email,
				'UpdateTime': date.getTime(),
				'CreateTime': date.getTime(),
				"IsDelete": false
			}, {w: 1}, function(err, records){
				console.log("Record added as "+records);
			});

			// 假设都是成功的
			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(JSON.stringify({"Id": Core.$counter.comment}));
			response.end();
		});

	},
	// 修改评论 －暂未实现
	// @todo 仅留言者本人或者管理员可修改
	update: function(response, request){

		// 自增
		Core.updateCounter('comment');

		// POST
		var body = '';

		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			// 当前登陆用户信息
			var user = Core.$user;
			var isVisitor = user.Role== 'visitor';

			// 当前时间
			var date = new Date();

			var cm = db.collection('comment');
			cm.update({
				'Id': +data.Id
			},{$set: {
				'PostId': +data.PostId,
				'UserId': +data.UserId,
				'Content': data.Content || '',
				'UpdateTime': date.getTime(),
				"IsDelete": false
			}}, function(err, records){
				console.log(err);
				console.log(records);
			});

			// 假设都是成功的
			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(JSON.stringify(data));
			response.end();
		});
	},

	// 删除评论 -软删 @暂未实现
	// @todo 仅发布者或者管理员或者留言者本人可修改
	remove: function(response, request){
		// GET
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var collection = db.collection('comment');
		collection.update(
			{
				'Id': +param.Id
			},
			{
				$set: {
					'IsDelete': true
				}
			}, function(err, records){
				console.log(err);
				console.log(records);
			}
		);

		// 假设都是成功的
		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(JSON.stringify('删除成功'));
		response.end();
	}

};
exports.comment = Comment;

// 用户
var User = {
	// 添加用户
	create: function(response, request){
		// POST
		var body = '';

		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			var userDb = db.collection('user');
			// 验证邮箱是否已注册过
			userDb.find({"Email": data.Email}).toArray(function(err, userData) {

				var isExist = userData.length;
				if(isExist){
					response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
					response.write(JSON.stringify({err: "此邮箱已被注册"}));
					response.end();
					return;
				}

				// 新增用户
				Core.updateCounter('user');
				userDb.insert({
					'Id': Core.$counter.user,				// 自增
					'Name': data.Name || '',
					'Email': data.Email || '',
					'Password': data.Password || 0,			// @todo 加密
					'Rights': data.Rights || [],
					'Role': data.Role || 0,
					'RegisterTime': data.RegisterTime || '',	// @todo 当前时间
					'LoginTime': data.LoginTime || '',
					"IsDelete": false
				}, {w: 1}, function(err, records){
					console.log(records);
				});

				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(JSON.stringify({"Id": Core.$counter.user}));
				response.end();
			});
		});
	},
	// 登陆
	login: function(response, request){
		// POST
		var body = '';

		request.on('data', function (data) {
			body += data;
		});

		request.on('end', function () {
			var data = querystring.parse(body);

			var user = db.collection('user');
			user.find({
				"Email": data.Email,
				"Password": data.Password,
				"IsDelete": false
			}).toArray(function(err, items){
				var result = null;
				if(err || !items.length){
					result = JSON.stringify({
						error: "用户名或密码不正确"
					});
				}else{
					console.log(items)
					Core.$user = items[0];
					result = JSON.stringify(items);
				}

				response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
				response.write(result);
				response.end();
			});

		});
	},
	// 当前登陆状态
	logininfo: function(response){
		var user = Core.$user;
		var result = user.Id ? user : null;

		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(JSON.stringify(result));
		response.end();
	},
	// 登出
	logout: function(response){
		Core.$user = {
			Id: 0,
			Name: '',
			Email: '',
			Role: 'visitor', // 游客，会员，管理员
		};
		var result = "已成功退出。"
		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(JSON.stringify(result));
		response.end();
	},
	// 删除用户 -软删
	remove: function(response, request){
		// GET
		var arg = url.parse(request.url).query;
		var param = querystring.parse(arg);

		var collection = db.collection('user');
		collection.update(
			{
				'Id': +param.Id
			},
			{
				$set: {
					'IsDelete': true
				}
			}, function(err, records){
				console.log(err);
				console.log(records);
			}
		);

		// 假设都是成功的
		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(JSON.stringify('删除成功'));
		response.end();
	}

};
exports.user = User;


