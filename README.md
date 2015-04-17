# Yeoman App

A desktop app that scaffolds projects using [Yeoman](https://github.com/yeoman/yeoman).

![Screenshot](http://i.imgur.com/QHYXruQ.jpg)

## Development

### Getting started

0. Clone and cd into the repository `git clone git@github.com:yeoman/yeoman-app.git && cd yeoman-app`
0. Run `script/bootstrap` once per checkout to install the dependencies.
0. Then run `script/build` to build the app (it takes some time).
0. Finally run `script/run` to execute the app.

If something goes wrong during the build process, run `script/clean` to remove temp files and clean the repository.

Another useful script is `script/grunt`, which will run the local version of Grunt. `script/grunt --help` will tell you the list of available tasks.

### Building

Our instructions and requirements are similar to Atom's  [build instructions](https://github.com/atom/atom/tree/master/docs/build-instructions).

### Folder structure

- **apm** - This folder is where [apm](https://github.com/atom/apm) is installed (will be removed soon).
- **build** - Grunt scripts used for building, packaging, testing, etc.
- **docs** - Documentation
- **menus** - Native menu representation
- **resources** - Icons, platform-dependent files ...
- **script** - Scripts used for development purpose like building, packaging, testing, etc.
- **spec** - Automatic tests.
- **src**
  - **browser** -  The frontend including the main window, UI, and all of the main process things. This talks to the renderer to manage web pages.
  - **renderer** - Code that runs in renderer process.
- **static** - Images, Stylesheets, HTML files ...
- **vendor** - Source code of third party dependencies.

### What's the "browser" vs "renderer" code?

[Electron](https://github.com/atom/Electron/) has (at least) two separate contexts - when your app first starts up, it is running in a DOM-less node.js loop - there are no windows. This is called the *Browser* context. The built-in code proceeds to start up a `BrowserWindow` object, which then creates a *Rendering* context, which is what you are more used to - it's got the Chrome DevTools and a DOM, yet it can *still* use node.js, as well as several Electron APIs that are made available. Check out the [documentation for Electron](https://github.com/atom/Electron/tree/master/docs/api) for more about what you can do.

## License

[MIT License](http://opensource.org/licenses/mit-license.php)
