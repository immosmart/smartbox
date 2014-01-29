module.exports = function ( grunt ) {

	var globalConfig = {
		platform: '',
		defaultFiles: ['src/*.js', 'src/plugins/*.js']
	};

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		globalConfig : globalConfig,

		jsdoc: {
			dist : {
				src: ['src/*.js', 'src/plugins/*.js', 'src/platforms/{,*/}*.js'],
				options: {
					destination: 'doc'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'src/*.js', 'src/plugins/*.js', 'src/platforms/{,*/}*.js'
			]
		},

		clean: {
			build: ['doc', 'dist']
		},

		concat: {
			options: {
				platform: ''
			},
			platform: {
				src: globalConfig.defaultFiles.concat(['src/platforms/<%= globalConfig.platform %>/*.js']),
				dest: 'dist/smartbox.js'
			},
			all: {
				src: globalConfig.defaultFiles.concat(['src/platforms/{,*/}*.js']),
				dest: 'dist/smartbox.js'
			}
		},

		uglify: {
			build: {
				files: {
					'dist/smartbox.min.js' : 'dist/smartbox.js'
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['clean','jsdoc']);
	grunt.registerTask('build', 'Build Smartbox for platform', function ( target ) {
		var concatTask = 'concat:';

		if (target && target !== 'all') {
			globalConfig.platform = target;
			concatTask += 'platform';
		} else {
			concatTask += 'all';
		}

		grunt.task.run('clean', concatTask ,'uglify');
	});
};