db lightBlogging
collections
user
catecory(channel)
article


user
=========
id, name, email, password, rights, role, registerTime, loginTime
1, Deliah, delilah@mail.com, 123, [], admin

post
=========
id, title, content, author(user_id), createTime, updateTime, channel, tag

channel
=========
id, name, desc, creator, createTime, updateTime

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
