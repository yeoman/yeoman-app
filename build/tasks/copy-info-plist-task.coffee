path = require 'path'
_ = require 'underscore-plus'

module.exports = (grunt) ->
  {cp,renderTemplate} = require('./task-helpers')(grunt)

  grunt.registerTask 'copy-info-plist', 'Copy plist', ->
    pkgName = grunt.config.get('name')
    pkgInfo = grunt.config.get(pkgName)

    contentsDir = grunt.config.get("#{pkgName}.contentsDir")
    appName = grunt.config.get("#{pkgName}.appName")
    appNameWithoutApp = appName.replace(/.app$/, '')

    plistPath = path.join(contentsDir, 'Info.plist')
    helperPlistPath = path.join(contentsDir, "Frameworks/#{appNameWithoutApp} Helper.app/Contents/Info.plist")

    # Copy custom plist files
    renderTemplate 'resources/mac/app-Info.plist', plistPath, pkgInfo
    renderTemplate 'resources/mac/helper-Info.plist',  helperPlistPath, pkgInfo
