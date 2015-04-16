# lightBlogging

 一个轻博客。

#### 开发目的：

尝试独立完成一个完整的web小项目，包括原型设计、视觉设计、前端界面、交互逻辑、数据库设计、后端逻辑等。

#### 基本功能：

- 文章 －增删改查
- 评论 －增删改查
- 登陆、注册
- 权限设计（游客、会员、管理员）

#### 涉及的技术：

- Javascript
- HTML, CSS
- [Nodejs](https://nodejs.org/api/crypto.html)
- [Seajs](http://seajs.org/docs/) -前端模块化
- [Mongodb](http://docs.mongodb.org/manual/) －数据库
- [LESS](http://lesscss.org) -CSS预处理语言

#### 引用的资源：

- [jQuery](https://jquery.com/)
- [Handlebars.js](http://handlebarsjs.com/) -Javascript 模板引擎
- [UIkit](https://github.com/uikit/uikit) －轻量级前端 UI 框架
- [KindEditor](http://kindeditor.org/) －轻量开源 HTML 编辑器
- [CryptoJS](http://code.google.com/p/crypto-js/) -JavaScript加密库 32-bit/UTF-8


#### 使用的工具：

- [Balsamiq Mockups](https://balsamiq.com/) -原型设计
- [Grunt](http://gruntjs.com/) -基于JavaScript的任务运行工具
	1. watch 监测文件变动
	2. jshint 拼写检查
	3. LESS 编译
	4. @Todo: 压缩、单元测试

#### 运行：

- 启动 Mongo 数据库: `mongod`
- 启动 Nodejs 服务器：`node server/index.js`
- 浏览器访问：`http://localhost:8888`