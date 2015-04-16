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
						,"LANG"
						,"ROOT"
						,"PUBJS"
						,"_T"
						,"seajs"
						,"BASE"
						,"Handlebars"
					],
					globals: {
						jQuery: true
						,browser:true
					}
				}
		},

		less: {
			dev: {
				files:{
					'resources/css/app.css': 'resources/less/app.less'
				}
			},
			old: {
				files:{
					'resources/css/app.css': 'resources/css/app.less'
				}
			},
			product:{
				files:{
					'release/resources/css/app.css': 'resources/less/app.less'
				},
				options:{
					yuicompress: true
				}
			},
			options: {
				paths: ['.', 'resources/less']
			}
		},
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
					'resources/less/**/*.less',
					'resources/less/*/*.less'
				],
				tasks: ['less:dev']
			},
			icons: {
				files: [
					'resources/icons/list.txt'
				],
				tasks:['shell:icon']
			}
		},

		uglify: {
		  options: {
		    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		  },
		  build: {
		    src: 'src/<%= pkg.name %>.js',
		    dest: 'build/<%= pkg.name %>.min.js'
		  }
		}
	});

	/* ---- Load the plugin ---- */


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-copy');
	// grunt.loadNpmTasks('grunt-shell');


	/* ---- tasks ---- */

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
	// grunt.registerTask('build-icon', ['shell:icon']);
	grunt.registerTask('build-release', ['build-icon', 'less:product', 'copy:release', 'gcc:release']);

	// Default task.
	grunt.registerTask('default', ['watch-all']);

	// default force mode
	grunt.option('force', true);

};