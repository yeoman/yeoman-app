fs = require 'fs'
path = require 'path'
_ = require 'underscore-plus'

module.exports = (grunt) ->
  {spawn, rm, mkdir, cp} = require('./task-helpers')(grunt)

  fillTemplate = (filePath, data) ->
    template = _.template(String(fs.readFileSync("#{filePath}.in")))
    filled = template(data)
    pkgName = grunt.config.get('name')

    outputPath = path.join(grunt.config.get("#{pkgName}.buildDir"), path.basename(filePath))
    grunt.file.write(outputPath, filled)
    outputPath

  grunt.registerTask 'mkrpm', 'Create rpm package', ->
    done = @async()
    @requiresConfig("#{@name}.categories")
    @requiresConfig("#{@name}.genericName")

    if process.arch is 'ia32'
      arch = 'i386'
    else if process.arch is 'x64'
      arch = 'amd64'
    else
      return done("Unsupported arch #{process.arch}")

    pkgName = grunt.config.get('name')
    {name, version, description} = grunt.config.get('pkg')
    buildDir = grunt.config.get("#{pkgName}.buildDir")
    appDir = grunt.config.get("#{pkgName}.appDir")
    shellAppDir = grunt.config.get("#{pkgName}.shellAppDir")
    appName = grunt.config.get("#{pkgName}.appName")

    rpmDir = path.join(buildDir, 'rpm')
    rm rpmDir
    mkdir rpmDir

    installDir = '/usr'
    shareDir = path.join(installDir, 'share', pkgName)
    iconName = path.resolve('.', 'resources', 'app.png')

    data = _.extend {}, grunt.config.get('pkg'),
      genericName: grunt.config.get("#{@name}.genericName")
      categories: grunt.config.get("#{@name}.categories")
      iconName: pkgName
      installDir: installDir
      appDir: appDir
      shellAppDir: shellAppDir

    specFilePath = fillTemplate(path.join('resources', 'linux', 'redhat', 'app.spec'), data)
    desktopFilePath = fillTemplate(path.join('resources', 'linux', "app.desktop"), data)
    realDesktopFilePath = path.join(path.dirname(desktopFilePath), "#{pkgName}.desktop")

    cp(desktopFilePath, realDesktopFilePath)
    rm(desktopFilePath)

    # NB: We have to copy over app.png because by the time we get to it, we're
    # already in an ASAR archive
    cp(iconName, path.join(shellAppDir, 'app.png'))

    cmd = path.join('script', 'mkrpm')
    args = [specFilePath, realDesktopFilePath, buildDir, pkgName, appName, iconName]

    grunt.verbose.ok "About to run #{cmd} #{args.join(' ')}"
    spawn {cmd, args}, (error) ->
      if error?
        done(error)
      else
        grunt.log.ok "Created rpm package in #{rpmDir}"
        done()
