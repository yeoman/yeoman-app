'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  var atomShellVersion = '0.18.2';
  var outDir = 'out';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'download-atom-shell': {
      version: atomShellVersion,
      outputDir: outDir,
      rebuild: true
    },
    watch: {
      scripts: {
        options: {
          livereload: true
        },
        files: [
          'Gruntfile.js',
          'app/**/*.js',
          'app/**/*.html',
          'app/**/*.css'
        ]
      }
    },
    shell: {
      mac: {
        command: outDir + '/Atom.app/Contents/MacOS/Atom app'
      },
      linux: {
        command: [
          'chmod +x ' + outDir + '/atom',
          outDir + '/atom app'
        ].join('&&')
      },
      win: {
        command: outDir + '\\atom.exe app'
      },
      copyMacApp: {
        command: [
          'cp -a ' + outDir + ' dist',
          'cp -a app/ dist/Atom.app/Contents/Resources/app'
        ].join('&&')
      },
      copyLinuxApp: {
        command: [
          'cp -R ' + outDir + ' dist',
          'cp -R app/ dist/resources/app'
        ].join('&&')
      },
      copyWinApp: {
        command: [
          'echo d | xcopy /e /y /k /h ' + outDir + ' dist',
          'echo d | xcopy /e /y /k /h app dist\\resources\\app'
        ].join('&&')
      }
    },
    parallel: {
      options: {
        stream: true
      },
      mix: {
        tasks: [
          {
            grunt: true,
            args: ['watch']
          },
          {
            grunt: true,
            args: ['run']
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/**/*.js'
      ]
    }
  });

  grunt.registerTask('run', 'run...', function () {
    if (process.platform === 'darwin') {
      grunt.task.run('shell:mac');
    } else if (process.platform === 'win32') {
      grunt.task.run('shell:win');
    } else {
      grunt.task.run('shell:linux');
    }
  });

  grunt.registerTask('dist', 'dist...', function () {
    if (process.platform === 'darwin') {
      grunt.task.run('shell:copyMacApp');
    } else if (process.platform === 'win32') {
      grunt.task.run('shell:copyWinApp');
    } else {
      grunt.task.run('shell:copyLinuxApp');
    }
  });

  grunt.registerTask('init', 'init...', [
    'download-atom-shell',
    'jshint',
    'parallel'
  ]);

  grunt.registerTask('default', ['menu']);
};
