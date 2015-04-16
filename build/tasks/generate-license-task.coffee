fs = require 'fs'
path = require 'path'

module.exports = (grunt) ->
  {spawn, rm, mkdir, cp} = require('./task-helpers')(grunt)

  grunt.registerTask 'generate-license', 'Generate the license, including the licenses of all dependencies', (mode) ->
    legalEagle = require 'legal-eagle'
    done = @async()

    options =
      path: process.cwd()
      overrides: require './license-overrides'

    legalEagle options, (err, dependencyLicenses) ->
      if err?
        console.error(err)
        exit 1

      licenseText = getLicenseText(dependencyLicenses)
      if mode is 'save'
        pkgName = grunt.config.get('name')
        targetPath = path.join(grunt.config.get("#{pkgName}.appDir"), 'LICENSE.md')
        fs.writeFileSync(targetPath, licenseText)

        # NB: We need to copy this to the directory above the appDir too so that
        # we have a copy that we can use in mkdeb
        cp targetPath, path.join(grunt.config.get("#{pkgName}.shellAppDir"), 'LICENSE.md')
      else
        console.log licenseText
        
      done()

getLicenseText = (dependencyLicenses) ->
  {keys} = require 'underscore-plus'
  text = """
    #{fs.readFileSync('LICENSE.md', 'utf8')}

    This application bundles the following third-party packages in accordance
    with the following licenses:\n\n
  """
  names = keys(dependencyLicenses).sort()
  for name in names
    {license, source, sourceText} = dependencyLicenses[name]

    text += "-------------------------------------------------------------------------\n\n"
    text += "Package: #{name}\n"
    text += "License: #{license}\n"
    text += "License Source: #{source}\n" if source?
    if sourceText?
      text += "Source Text:\n\n"
      text += sourceText
    text += '\n'
  text
