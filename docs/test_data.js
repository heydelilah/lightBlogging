静态数据
=====================

reset
============
db.user.drop();
db.post.drop();
db.comment.drop();
db.counter.drop();

db.counter.insert({
	"_id": 0,
	"user": 0,
	"post": 3,
	"tag": 0,
	"channel": 0,
	"comment": 3
});
db.user.insert({
	"Id": 1,
	"Name": "Delilah",
	"Email": "delilah@mail.com",
	"Password": "123",
	"Role": "member",
	"CreateTime": "1428117088028",
	"IsDelete": false
});
db.user.insert({
	"Id": 2,
	"Name": "Jing",
	"Email": "jing@mail.com",
	"Password": "123",
	"Role": "admin",
	"CreateTime": "1428117088028",
	"IsDelete": false
});

db.post.insert({
	"Id": 1,
	"Title": "Death With Dignity - Sufjan Stevens",
	"Content": "<p data=\"ddd\">test</p>",
	"UserId": 1,
	"UserName": "Jing",
	"CreateTime": "1428117088028",
	"UpdateTime": "1428117088028",
	"Channel": 1,
	"Tag": 1,
	"IsDelete": false
});
db.post.insert({
	"Id": 2,
	"Title": "Space Oddity",
	"Content": "sss",
	"UserId": 1,
	"UserName": "Jing",
	"CreateTime": "1428135140155",
	"UpdateTime": "1428135140155",
	"Channel": 1,
	"Tag": 1,
	"IsDelete": false
});
db.comment.insert({
	"Id": 3,
	"Content": "Thank you all.",
	"PostId": 1,
	"UserId": 1,
	"Name": "Jing",
	"Email": "member@mail.com",
	"CreateTime": "1428135140155",
	"UpdateTime": "1428135140155",
	"IsDelete": false
});
db.comment.insert({
	"Id": 2,
	"Content": "I am visitor~, I love this post.",
	"PostId": 1,
	"UserId": 0,
	"Name": "vistors",
	"Email": "vistors@mail.com",
	"CreateTime": "1428135140155",
	"UpdateTime": "1428135140155",
	"IsDelete": false
});
db.comment.insert({
	"Id": 1,
	"Content": "Hi, how are you ? I love this post.",
	"PostId": 1,
	"UserId": 2,
	"CreateTime": "1428135140155",
	"UpdateTime": "1428135140155",
	"Name": "lily",
	"Email": "vistors@mail.com",
	"IsDelete": false
});




channel
=========
id, name, desc, creator, createTime, updateTime

role
=========
id name, rights
1, admin,
2, user,


