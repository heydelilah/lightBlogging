var fs = require('fs');
// var querystring = require("querystring");
// var formidable = require('formidable');
var mongodb = require('mongodb');

function start(response) {
	var file = fs.readFileSync('index.html');

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(file);
	response.end()
}
exports.start = start;

function connect(cb){
	// Retrieve
	var MongoClient = mongodb.MongoClient;

	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
		if(!err) {
			console.log("We are connected");

			var collection = db.collection('blog');

			collection.find().toArray(function(err, items) {
				console.log(items);
				cb(JSON.stringify(items));
			});


		}else{
			console.log('error');
		}
	});
}

function blogData(response) {
	connect(function(data){
		response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
		response.write(data);
		response.end()
	});
}
exports.blogData = blogData;