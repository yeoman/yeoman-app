path = require 'path'
fs = require 'fs-plus'

module.exports = (grunt) ->
  {spawn} = require('./task-helpers')(grunt)

  grunt.registerTask 'codesign', 'Codesign the app', ->
    done = @async()

    if process.platform is 'darwin' and process.env.XCODE_KEYCHAIN
      unlockKeychain (error) ->
        if error?
          done(error)
        else
          signApp(done)
    else
      signApp(done)

  unlockKeychain = (callback) ->
    cmd = 'security'
    { XCODE_KEYCHAIN_PASSWORD, XCODE_KEYCHAIN } = process.env
    args = ['unlock-keychain', '-p', XCODE_KEYCHAIN_PASSWORD, XCODE_KEYCHAIN]
    spawn {cmd, args}, (error) -> callback(error)

  signApp = (callback) ->
    pkgName = grunt.config.get('name')
    shellAppDir = grunt.config.get("#{pkgName}.shellAppDir")
    {XCODE_SIGNING_IDENTITY} = process.env

    switch process.platform
      when 'darwin'
        cmd = 'codesign'
        args = ['--deep', '--force', '--verbose', '--sign', XCODE_SIGNING_IDENTITY, shellAppDir]
        spawn {cmd, args}, (error) -> callback(error)
      else
        callback()
