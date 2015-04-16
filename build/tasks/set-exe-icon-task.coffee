path = require 'path'

module.exports = (grunt) ->
  grunt.registerTask 'set-exe-icon', 'Set icon of the exe', ->
    done = @async()

    pkgName = grunt.config.get('name')
    shellAppDir = grunt.config.get("#{pkgName}.shellAppDir")
    executableName = grunt.config.get("#{pkgName}.executableName")
    shellExePath = path.join(shellAppDir, executableName)
    iconPath = path.resolve('resources', 'win', 'app.ico')

    rcedit = require('rcedit')
    rcedit(shellExePath, {'icon': iconPath}, done)
