fs = require 'fs'
path = require 'path'
_ = require 'underscore-plus'

module.exports = (grunt) ->
  {spawn,cp,rm} = require('./task-helpers')(grunt)

  fillTemplate = (filePath, data) ->
    pkgName = grunt.config.get('name')
    template = _.template(String(fs.readFileSync("#{filePath}.in")))
    filled = template(data)

    outputPath = path.join(grunt.config.get("#{pkgName}.buildDir"), path.basename(filePath))
    grunt.file.write(outputPath, filled)
    outputPath

  getInstalledSize = (appDir, callback) ->
    cmd = 'du'
    args = ['-sk', appDir]

    spawn {cmd, args}, (error, {stdout}) ->
      installedSize = stdout.split(/\s+/)?[0] or '200000' # default to 200MB
      callback(null, installedSize)

  grunt.registerTask 'mkdeb', 'Create debian package', ->
    done = @async()
    @requiresConfig("#{@name}.section")
    @requiresConfig("#{@name}.categories")
    @requiresConfig("#{@name}.genericName")

    pkgName = grunt.config.get('name')
    buildDir = grunt.config.get("#{pkgName}.buildDir")
    appDir = grunt.config.get("#{pkgName}.appDir")

    if process.arch is 'ia32'
      arch = 'i386'
    else if process.arch is 'x64'
      arch = 'amd64'
    else
      return done("Unsupported arch #{process.arch}")

    data = _.extend {}, grunt.config.get('pkg'),
      section: grunt.config.get("#{@name}.section")
      genericName: grunt.config.get("#{@name}.genericName")
      categories: grunt.config.get("#{@name}.categories")
      installDir: '/usr'
      iconName: 'app'
      arch: arch

    data.maintainer = data.author

    {version, author} = data

    getInstalledSize buildDir, (error, installedSize) ->
      data.installedSize = installedSize

      controlFilePath = fillTemplate(path.join('resources', 'linux', 'debian', 'control'), data)
      desktopFilePath = fillTemplate(path.join('resources', 'linux', 'app.desktop'), data)
      realDesktopFilePath = path.join(path.dirname(desktopFilePath), "#{pkgName}.desktop")

      cp(desktopFilePath, realDesktopFilePath)
      rm(desktopFilePath)

      icon = path.join('resources', 'app.png')

      cmd = path.join('script', 'mkdeb')
      args = [version, arch, controlFilePath, realDesktopFilePath, icon, buildDir, data.name]

      grunt.verbose.ok "About to invoke #{cmd} #{args.join(' ')}"
      spawn {cmd, args}, (error) ->
        if error?
          done(error)
        else
          grunt.log.ok "Created #{buildDir}/#{pkgName}-#{version}-#{arch}.deb"
          done()
