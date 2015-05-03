asar = require 'asar'
path = require 'path'

module.exports = (grunt) ->
  {rm} = require('./task-helpers')(grunt)

  grunt.registerTask 'generate-asar', 'Generate asar archive for the app', ->
    done = @async()
    pkgName = grunt.config.get('name')

    appDir = grunt.config.get("#{pkgName}.appDir")
    target = path.resolve(appDir, '..', 'app.asar')

    grunt.verbose.ok "Generating asar archive from #{appDir} => #{target}"
    asar.createPackageWithOptions appDir, target, {unpack: "*.node"}, (err) ->
      return done(err) if err?
      rm appDir
      done()
