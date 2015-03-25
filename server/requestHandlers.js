var fs = require('fs');
var url = require('url');
var querystring = require("querystring");
// var formidable = require('formidable');
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

function connect(){
	// Retrieve
	var MongoClient = mongodb.MongoClient;

	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/test", function(err, database) {
		if(!err) {
			console.log("We are connected");

			// 赋予全局变量
			db = database;

		}else{
			console.log('error');
		}
	});
}


// 获取post的全部数据
function blogData(response) {
	if(db){
		var collection = db.collection('blog');

		collection.find().toArray(function(err, items) {
			console.log(items);
			var data = JSON.stringify(items);

			response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
			response.write(data);
			response.end();

		});

	}
}
exports.blogData = blogData;

// 添加用户
function addUser(res, req){
	console.log(req.url)
	var arg = url.parse(req.url).query;

	var str = querystring.parse(arg); 
	console.log(str);  
	if(db){
		var collection = db.collection('user');
	}
}
exports.addUser = addUser;