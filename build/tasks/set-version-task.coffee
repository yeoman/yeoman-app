fs = require 'fs'
path = require 'path'

module.exports = (grunt) ->
  {spawn} = require('./task-helpers')(grunt)

  getVersion = (callback) ->
    pkgName = grunt.config.get('name')

    inRepository = fs.existsSync(path.resolve(__dirname, '..', '..', '.git'))

    {version} = grunt.config.get('pkg')

    if not inRepository
      callback(null, version)
    else
      cmd = 'git'
      args = ['rev-parse', '--short', 'HEAD']
      spawn {cmd, args}, (error, {stdout}={}, code) ->
        commitHash = stdout?.trim?()
        combinedVersion = "#{version}-#{commitHash}"
        callback(error, combinedVersion)

  grunt.registerTask 'set-version', 'Set the version in the plist and package.json', ->
    done = @async()

    pkgName = grunt.config.get('name')

    getVersion (error, version) ->
      if error?
        done(error)
        return

      appDir = grunt.config.get("#{pkgName}.appDir")

      # Replace version field of package.json.
      packageJsonPath = path.join(appDir, 'package.json')
      packageJson = require(packageJsonPath)
      packageJson.version = version
      packageJsonString = JSON.stringify(packageJson)
      fs.writeFileSync(packageJsonPath, packageJsonString)

      appName = grunt.config.get("#{pkgName}.appName")

      if process.platform is 'darwin'
        cmd = 'script/set-version'
        args = [grunt.config.get("#{pkgName}.buildDir"), version, appName]
        spawn {cmd, args}, (error, result, code) -> done(error)
      else if process.platform is 'win32'
        shellAppDir = grunt.config.get("#{pkgName}.shellAppDir")
        productName = grunt.config.get("#{pkgName}.productName")
        executableName = grunt.config.get("#{pkgName}.executableName")

        shellExePath = path.join(shellAppDir, executableName)

        strings =
          CompanyName: packageJson.authors
          FileDescription: productName
          LegalCopyright: packageJson.copyright ? ''
          ProductName: productName
          ProductVersion: version

        rcedit = require('rcedit')
        rcedit(shellExePath, {'version-string': strings}, done)
      else
        done()
