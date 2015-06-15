# Folder structure

The source code is separated into a few parts.

- **docs** - Documentation
- **menus** - Native menu representation
- **resources** - Icons, platform-dependent files ...
- **script** - Scripts used for development purpose like building
- **spec** - Automatic tests
- **src**
  - **browser** -  The frontend including the main window, UI, and all of the main process things. This talks to the renderer to manage web pages.
  - **renderer** - Code that runs in renderer process.
- **static** - Images, Stylesheets, HTML files ...
- **vendor** - Source code of third party dependencies.
