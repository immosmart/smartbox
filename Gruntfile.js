module.exports = function ( grunt ) {

  var globalConfig = {
    platform: '',
    defaultFiles: [
      'src/sb.events.js',
      'src/sb.js',
      'src/sb.platform.js',
      'src/plugins/*.js'
    ]
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    globalConfig: globalConfig,
    /*
     jsdoc: {
     dist : {
     src: ['src/*.js', 'src/plugins/*.js'],
     options: {
     destination: 'doc'
     }
     }
     },
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'src/*.js', 'src/plugins/*.js', 'src/platforms/{,*/}*.js'
      ]
    },

    cssmin: {
      combine: {
        files: {
          'dist/smartbox.css': ['css/*.css']
        }
      }
    },

    clean: {
      build: ['dist']
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
      },
      demo: {
        src: globalConfig.defaultFiles.concat(['src/platforms/{,*/}*.js']),
        dest: 'demo/demoApp/js/asset/smartbox.js'
      }
    },

    uglify: {
      build: {
        files: {
          'dist/smartbox.min.js': 'dist/smartbox.js'
        }
      }
    },

    watch: {
      all: {
        files: ['src/*.js', 'src/platforms/{,*/}*.js', 'src/plugins/*.js' ],
        tasks: ['build']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['clean']);
  grunt.registerTask('build', 'Build Smartbox for platform', function ( target ) {
    var concatTask = 'concat:';

    if ( target && target !== 'all' ) {
      globalConfig.platform = target;
      concatTask += 'platform';
    } else {
      concatTask += 'all';
    }

    grunt.task.run('clean', concatTask, 'concat:demo','uglify', 'cssmin');
  });
};