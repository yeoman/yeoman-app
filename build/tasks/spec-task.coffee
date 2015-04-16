async = require 'async'
path = require 'path'

module.exports = (grunt) ->
  {spawn} = require('./task-helpers')(grunt)

  getAppPath = ->
    pkgName = grunt.config.get 'name'

    contentsDir = grunt.config.get(pkgName + '.contentsDir')
    switch process.platform
      when 'darwin'
        path.join(contentsDir, 'MacOS', pkgName)
      when 'linux'
        path.join(contentsDir, 'atom')
      when 'win32'
        path.join(contentsDir, 'atom.exe')

  runCoreSpecs = (callback) ->
    appPath = getAppPath()
    resourcePath = process.cwd()
    coreSpecsPath = path.resolve('spec')

    if process.platform in ['darwin', 'linux']
      options =
        cmd: appPath
        args: ['--test', "--resource-path=#{resourcePath}", "--spec-directory=#{coreSpecsPath}"]
    else if process.platform is 'win32'
      options =
        cmd: process.env.comspec
        args: ['/c', appPath, '--test', "--resource-path=#{resourcePath}", "--spec-directory=#{coreSpecsPath}", "--log-file=ci.log"]

    spawn options, (error, results, code) ->
      if process.platform is 'win32'
        process.stderr.write(fs.readFileSync('ci.log')) if error
        fs.unlinkSync('ci.log')

      callback(null, error)

  grunt.registerTask 'run-specs', 'Run the specs', ->
    done = @async()
    startTime = Date.now()
    runCoreSpecs (error, results) ->
      elapsedTime = Math.round((Date.now() - startTime) / 100) / 10
      grunt.log.ok("Total spec time: #{elapsedTime}s")
      grunt.log.error("[Error]".red + " core spec failed") if results
      done(!results)
