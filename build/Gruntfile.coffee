fs = require 'fs'
path = require 'path'
os = require 'os'
_ = require 'underscore-plus'

# Add support for obsolete APIs of vm module so we can make some third-party
# modules work under node v0.11.x.
require 'vm-compatibility-layer'

_ = require 'underscore-plus'

packageJson = require '../package.json'

module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-lesslint')
  grunt.loadNpmTasks('grunt-cson')
  grunt.loadNpmTasks('grunt-contrib-csslint')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-build-atom-shell')
  grunt.loadNpmTasks('grunt-atom-shell-installer')
  grunt.loadNpmTasks('grunt-peg')
  grunt.loadTasks('tasks')

  # This allows all subsequent paths to the relative to the root of the repo
  grunt.file.setBase(path.resolve('..'))

  if not grunt.option('verbose')
    grunt.log.writeln = (args...) -> grunt.log
    grunt.log.write = (args...) -> grunt.log

  [major, minor, patch] = packageJson.version.split('.')
  tmpDir = os.tmpdir()

  pkgName = packageJson.name
  productName = packageJson.productName
  appName = if process.platform is 'darwin' then "#{productName}.app" else productName
  executableName = if process.platform is 'win32' then "#{productName}.exe" else productName
  executableName = executableName.toLowerCase() if process.platform is 'linux'

  buildDir = grunt.option('build-dir') ? path.join(tmpDir, "#{pkgName}-build")
  buildDir = path.resolve(buildDir)
  installDir = grunt.option('install-dir')

  home = process.env.HOME ? process.env.USERPROFILE

  symbolsDir = path.join(buildDir, "#{productName}.breakpad.syms")
  shellAppDir = path.join(buildDir, appName)

  if process.platform is 'win32'
    contentsDir = shellAppDir
    appDir = path.join(shellAppDir, 'resources', 'app')
    installDir ?= path.join(process.env.ProgramFiles, appName)
    killCommand = "taskkill /F /IM #{executableName}"
  else if process.platform is 'darwin'
    contentsDir = path.join(shellAppDir, 'Contents')
    appDir = path.join(contentsDir, 'Resources', 'app')
    installDir ?= path.join('/Applications', appName)
    killCommand = "pkill -9 #{executableName}"
  else
    contentsDir = shellAppDir
    appDir = path.join(shellAppDir, 'resources', 'app')
    installDir ?= process.env.INSTALL_PREFIX ? '/usr/local'
    killCommand = "pkill -9 #{executableName}"

  installDir = path.resolve(installDir)

  coffeeConfig =
    glob_to_multiple:
      expand: true
      src: [
        'src/**/*.coffee'
        'static/**/*.coffee'
      ]
      dest: appDir
      ext: '.js'

  lessConfig =
    options:
      paths: [
        'static'
      ]
    glob_to_multiple:
      expand: true
      src: [
        'static/**/*.less'
      ]
      dest: appDir
      ext: '.css'

  csonConfig =
    options:
      rootObject: true
      cachePath: path.join(home, ".#{pkgName}", 'compile-cache', 'grunt-cson')

    glob_to_multiple:
      expand: true
      src: [
        'menus/*.cson'
        'keymaps/*.cson'
        'static/**/*.cson'
      ]
      dest: appDir
      ext: '.json'

  opts =
    name: pkgName

    pkg: grunt.file.readJSON('package.json')

    coffee: coffeeConfig

    less: lessConfig

    cson: csonConfig

    coffeelint:
      options:
        configFile: 'coffeelint.json'
      src: [
        'src/**/*.coffee'
      ]
      build: [
        'build/tasks/**/*.coffee'
        'build/Gruntfile.coffee'
      ]
      test: [
        'spec/*.coffee'
      ]

    csslint:
      options:
        'adjoining-classes': false
        'duplicate-background-images': false
        'box-model': false
        'box-sizing': false
        'bulletproof-font-face': false
        'compatible-vendor-prefixes': false
        'display-property-grouping': false
        'fallback-colors': false
        'font-sizes': false
        'gradients': false
        'ids': false
        'important': false
        'known-properties': false
        'outline-none': false
        'overqualified-elements': false
        'qualified-headings': false
        'unique-headings': false
        'universal-selector': false
        'vendor-prefix': false
      src: [
        'static/**/*.css'
      ]

    lesslint:
      src: [
        'static/**/*.less'
      ]

    'build-atom-shell':
      tag: "v0.24.0"
      nodeVersion: '0.24.0'
      remoteUrl: "https://github.com/atom/atom-shell"
      buildDir: buildDir
      rebuildPackages: true
      projectName: pkgName
      productName: productName

    'create-windows-installer':
      appDirectory: shellAppDir
      outputDirectory: path.join(buildDir, 'installer')
      authors: packageJson.author
      iconUrl: packageJson.iconUrl ? 'https://raw.githubusercontent.com/atom/atom/master/resources/atom.png'

    mkdeb:
      section: 'misc'
      categories: 'GNOME;GTK;Development;Documentation'
      genericName: 'Demo Application'

    mkrpm:
      categories: 'GNOME;GTK;Development;Documentation'
      genericName: 'Demo Application'

    bower:
      install:
        options:
          targetDir: 'static/components'

    shell:
      'kill-app':
        command: killCommand
        options:
          stdout: false
          stderr: false
          failOnError: false

  opts[pkgName] = {appDir, appName, symbolsDir, buildDir, contentsDir, installDir, shellAppDir, productName, executableName}

  grunt.initConfig(opts)

  grunt.registerTask('compile', ['coffee', 'cson'])
  grunt.registerTask('lint', ['coffeelint', 'csslint', 'lesslint'])
  grunt.registerTask('test', ['shell:kill-app', 'run-specs'])

  ciTasks = ['output-disk-space', 'build-atom-shell', 'bower:install', 'build', 'generate-license']
  ciTasks.push('dump-symbols') if process.platform isnt 'win32'
  ciTasks.push('set-version', 'check-licenses', 'lint', 'generate-asar')
  ciTasks.push('mkdeb') if process.platform is 'linux'
  ciTasks.push('create-windows-installer') if process.platform is 'win32'
  ciTasks.push('test') if process.platform is 'darwin'
  ciTasks.push('codesign')
  grunt.registerTask('ci', ciTasks)

  defaultTasks = ['build-atom-shell', 'bower:install', 'build', 'set-version', 'generate-asar']
  grunt.registerTask('default', defaultTasks)
