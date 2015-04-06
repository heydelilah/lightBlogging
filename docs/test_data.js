静态数据
=====================

reset
============
db.user.drop();
db.post.drop();
db.comment.drop();

db.user.insert({
	"Id": 1,
	"Name": "Delilah",
	"Email": "delilah@mail.com",
	"Password": "123",
	"Role": 1
});
db.post.insert({
	"Id": 1,
	"Title": "Death With Dignity - Sufjan Stevens",
	"Content": "<p data=\"ddd\">test</p>",
	"UserId": 1,
	"CreateTime": "1428117088028",
	"UpdateTime": "1428117088028",
	"Channel": 1,
	"Tag": 1
});
db.post.insert({
	"Id": 2,
	"Title": "Space Oddity",
	"Content": "",
	"UserId": 1,
	"CreateTime": "1428135140155",
	"UpdateTime": "1428135140155",
	"Channel": 1,
	"Tag": 1
});
db.comment.insert({
	"Id": 3,
	"Content": "Thank you all.",
	"PostId": 1,
	"UserId": 1
});
db.comment.insert({
	"Id": 2,
	"Content": "I am visitor~, I love this post.",
	"PostId": 1,
	"UserId": 0,
	"Name": "vistors",
	"Email": "vistors@mail.com"
});
db.comment.insert({
	"Id": 1,
	"Content": "Hi, how are you ? I love this post.",
	"PostId": 1,
	"UserId": 2
});




channel
=========
id, name, desc, creator, createTime, updateTime

role
=========
id name, rights
1, admin, 
2, user,


