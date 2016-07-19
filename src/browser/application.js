import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { EventEmitter } from 'events';
import _ from 'underscore-plus';
import AppMenu from './appmenu';
import AppWindow from './appwindow';

class Application extends EventEmitter {

  /**
   * The application's class.
   *
   * It's the entry point into the application and maintains the global state of the application.
   *
   * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
   * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
   */
  constructor(options = {}) {
    super();
    this.pkgJson = require('../../package.json');
    this.windows = [];

    this.handleEvents();
    this.openWithOptions(options);
  }

  /**
   * Opens a new window based on the options provided.
   *
   * @param {boolean} [options.test]          Boolean to determine if the application is running in test mode.
   * @param {boolean} [options.exitWhenDone]  Boolean to determine whether to automatically exit.
   */
  openWithOptions(options) {
    let newWindow;
    let { test } = options;

    if (test) {
      if (options.exitWhenDone === undefined) {
        options.exitWhenDone = true;
      }
      newWindow = this.openSpecsWindow(options);
    } else {
      newWindow = this.openWindow(options);
    }

    newWindow.show();
    this.windows.push(newWindow);
    newWindow.on('closed', () => {
      this.removeAppWindow(newWindow);
    });
  }

  /**
   * Opens up a new AtomWindow to run specs within.
   *
   * @param {boolean} [options.exitWhenDone] Boolean to determine whether to automatically exit.
   */
  openSpecsWindow(options) {
    let bootstrapScript;
    let exitWhenDone = options.exitWhenDone;

    try {
      bootstrapScript = require.resolve(path.resolve(__dirname, 'spec', 'helpers', 'bootstrap'));
    } catch (error) {
      bootstrapScript = require.resolve(path.resolve(__dirname, '..', '..', 'spec', 'helpers', 'bootstrap'));
    }

    return new AppWindow({
      bootstrapScript: bootstrapScript,
      exitWhenDone: exitWhenDone,
      isSpec: true,
      title: `${this.pkgJson.productName}\'s Spec Suite`
    });
  }

  /**
   * Opens up a new AppWindow and runs the application.
   */
  openWindow() {
    let iconPath = path.resolve(__dirname, '..', '..', 'resources', 'app.png');

    let appWindow;
    appWindow = new AppWindow({
      title: this.pkgJson.productName,
      icon: iconPath,
      width: 1024,
      height: 700,
      titleBarStyle: 'hidden-inset'
    });
    this.menu = new AppMenu({
      pkg: this.pkgJson
    });
    this.menu.attachToWindow(appWindow);
    this.menu.on('application:quit', function () {
      app.quit();
    });

    this.menu.on('application:report-issue', () => {
      shell.openExternal(this.pkgJson.bugs);
    });

    this.menu.on('window:reload', function () {
      BrowserWindow.getFocusedWindow().reload();
    });

    this.menu.on('window:toggle-full-screen', function () {
      let focusedWindow = BrowserWindow.getFocusedWindow();
      let fullScreen = true;
      if (focusedWindow.isFullScreen()) {
        fullScreen = false;
      }

      focusedWindow.setFullScreen(fullScreen);
    });

    this.menu.on('window:toggle-dev-tools', function () {
      BrowserWindow.getFocusedWindow().toggleDevTools();
    });

    this.menu.on('application:run-specs', () => {
      return this.openWithOptions({
        test: true,
        exitWhenDone: false
      });
    });
    return appWindow;
  }

  /**
   * Removes the given window from the list of windows, so it can be GC'd.
   *
   * @param {AppWindow} appWindow The AppWindow to be removed
   */
  removeAppWindow(appWindow) {
    this.windows.forEach((win, index) => {
      if (win === appWindow) {
        this.windows.splice(index, 1);
      }
    });
  }

  handleEvents() {
    this.on('application:quit', function () {
      return app.quit();
    });

    ipcMain.on('context-appwindow', (event, ...args) => {
      let appWindow = this.windowForEvent(event.sender);
      appWindow.emit(...args);
    });

    ipcMain.on('context-generator', (event, ...args) => {
      let appWindow = this.windowForEvent(event.sender);
      appWindow.sendCommandToProcess(...args);
    });
  }

  // Returns the {AppWindow} for the given ipc event.
  windowForEvent(sender) {
    let win = BrowserWindow.fromWebContents(sender);
    return _.find(this.windows, function (appWindow) {
      return appWindow.window === win;
    });
  }

}

export default function getApp(args) {
  return new Application(args);
}
