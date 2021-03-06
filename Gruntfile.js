module.exports = function(grunt) {

	var CONFIG_FILES = [
		'Gruntfile.js'
	];
	var CLIENT_FILES = [
		'init.js',
		'web/project/*/*/*.js',
		'web/project/*/*.js',
		'web/project/*/*/*.js',
		'web/project/*.js',
		'web/controller/*.js',
		'web/public/*.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// JS语法检测
		jshint: {
			config: {
				files: {
					src: CONFIG_FILES
				},
				options: {
					node: true
				}
			},
			client: CLIENT_FILES,
			options: {
				asi:true,
				curly:true,
				latedef:true,
				forin:false,
				noarg:false,
				sub:true,
				undef:true,
				unused:'vars',
				boss:true,
				eqnull:true,
				browser:true,
				laxcomma:true,
				devel:true,
				smarttabs:true,
				predef:[
					"require"
					,"define"
					,"console"
					,"extend"
					,"ROOT"
					,"seajs"
					,"BASE"
				],
				globals: {
					jQuery: true
					,browser:true
				}
			}
		},

		// less编译
		less: {
			dev: {
				files:{
					'web/resources/main.css': 'web/less/main.less'
				}
			},
			product:{
				files:{
					'web/resources/main.css': 'web/less/main.less'
				},
				options:{
					yuicompress: true
				}
			},
			options: {
				paths: ['.', 'web/less']
			}
		},

		// 文件变动监测
		watch: {
			config: {
				files: CONFIG_FILES,
				tasks: ['jshint:config']
			},
			client: {
				files: CLIENT_FILES,
				tasks: ['jshint:client']
			},
			less: {
				files: [
					'web/less/*.less',
					'web/less/*/*.less'
				],
				tasks: ['less:dev']
			},
			icons: {
				files: [
					'resources/icons/list.txt'
				],
				tasks:['shell:icon']
			}
		}
	});

	/* ---- 加载插件 ---- */

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');


	/* ---- 注册任务 ---- */

	// "npm test" runs these tasks
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('test-client', ['jshint:client']);

	// Less compile
	grunt.registerTask('less-product', ['less:product']);

	// Watch tasks
	grunt.registerTask('watch-all', ['jshint','watch']);
	grunt.registerTask('watch-client', ['jshint:client','watch:client']);

	// Build task
	grunt.registerTask('build', ['less-product']);

	// Default task.
	grunt.registerTask('default', ['watch-all']);

	// default force mode
	grunt.option('force', true);

};