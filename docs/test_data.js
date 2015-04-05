db lightBlogging
collections
user
catecory(channel)
article

静态数据

用户
==========

1, Deliah, delilah@mail.com, 123, [], admin

var user = {
	"id": 1,
	"name": "Delilah",
	"email": "delilah@mail.com",
	"password": "123",
	"role": 1
}

post
=========
var post = {
	"id": 1,
	"title": "Death With Dignity - Sufjan Stevens",
	"content": "<p data=\"ddd\">test</p>",
	"userId": 1,
	"createTime": "1428117088028",
	"updateTime": "1428117088028",
	"channel": 1,
	"tag": 1

}

var post = {
	"id": 2,
	"title": "Space Oddity",
	"content": "",
	"userId": 1,
	"createTime": "1428135140155",
	"updateTime": "1428135140155",
	"channel": 1,
	"tag": 1

}


channel
=========
id, name, desc, creator, createTime, updateTime
1 
comment
=========
id, a_id(所属文章), (name/email)|user_id

role
=========
id name, rights
1, admin, 
2, user,



按频道过滤
按发布时间排序
按作者排序
按标签排序
