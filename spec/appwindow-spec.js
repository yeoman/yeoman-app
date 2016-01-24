var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('AppWindow', function () {

  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.fakeElectron = {
      BrowserWindow: this.sandbox.stub().returns({
        loadURL: this.sandbox.stub(),
        show: this.sandbox.stub(),
        on: this.sandbox.stub(),
        webContents: {
          reload: this.sandbox.stub(),
          on: this.sandbox.stub(),
          send: this.sandbox.stub()
        },
        setFullScreen: this.sandbox.stub(),
        toggleDevTools: this.sandbox.stub(),
        close: this.sandbox.stub(),
        isFullScreen: this.sandbox.stub()
      }),

      dialog: {
        showOpenDialog: this.sandbox.stub()
      },

      shell: {
        showItemInFolder: this.sandbox.stub()
      }
    };

    this.fakeKillChildProcess = this.sandbox.stub();

    var AppWindow = SandboxedModule.require('../src/browser/appwindow', {
      singleOnly: true,
      requires: {
        electron: this.fakeElectron,
        './util/kill-childprocess': this.fakeKillChildProcess
      }
    });

    this.appWindow = new AppWindow();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('#reload', function () {
    it('calls webContents #reload', function () {
      this.appWindow.reload();

      assert.equal(this.appWindow.window.webContents.reload.callCount, 1);
    });
  });

  describe('#toggleDevTools', function () {
    it('calls BrowserWindow #toggleDevTools', function () {
      this.appWindow.toggleDevTools();

      assert.equal(this.appWindow.window.toggleDevTools.callCount, 1);
    });
  });

  describe('#close', function () {
    it('call BrowserWindow #close', function () {
      this.appWindow.close();

      assert.equal(this.appWindow.window, null);
    });
  });

  describe('#openProject', function () {
    it('call with no arguments', function () {
      this.appWindow.openProject();

      assert(this.fakeElectron.shell.showItemInFolder.notCalled);
    });

    it('call with argument directory', function () {
      this.appWindow.openProject('/some/test/path');

      assert(this.fakeElectron.shell.showItemInFolder.calledOnce);
    });
  });

  describe('#toggleFullScreen', function () {
    it('setFullScreen if not', function () {
      this.appWindow.toggleFullScreen();

      var browserWindow = this.appWindow.window;
      assert(browserWindow.setFullScreen.calledOnce);
      assert(browserWindow.isFullScreen.calledOnce);
    });

    it('do not set fullscreen if window is fullscreen', function () {
      var browserWindow = this.appWindow.window;
      browserWindow.isFullScreen = this.sandbox.stub().returns(true);

      this.appWindow.toggleFullScreen();

      assert(browserWindow.setFullScreen.calledWithExactly(false));
    });

    it('set fullscreen if window its not fullscreen', function () {
      var browserWindow = this.appWindow.window;
      browserWindow.isFullScreen = this.sandbox.stub().returns(false);

      this.appWindow.toggleFullScreen();

      assert(browserWindow.setFullScreen.calledWithExactly(true));
    });
  });

  describe('#show', function () {

    it('Load static index.html', function () {
      var browserWindow = this.appWindow.window;
      var targetPath = '../../static/index.html';
      this.appWindow.show();

      browserWindow.loadURL.calledWith(targetPath);
      assert(browserWindow.loadURL.calledOnce);
    });

    it('Start listening for did-finish-load', function () {
      var browserWindow = this.appWindow.window;
      this.appWindow.show();

      assert.equal(browserWindow.webContents.on.args[0][0], 'did-finish-load');
    });

    it('show browserWindow', function () {
      var browserWindow = this.appWindow.window;
      this.appWindow.show();

      assert(browserWindow.show.calledOnce);
    });

    xit('init yoProcess', function () {
      // TODO
    });
  });

  describe('#handleEvents', function () {
    it('listen to "closed" event on window', function () {
      var browserWindow = this.appWindow.window;
      this.appWindow.handleEvents();

      assert(browserWindow.on.args[0][0], 'closed');
    });

    it('listen to other appwindow events', function () {
      this.appWindow.on = this.sandbox.stub();
      this.appWindow.handleEvents();

      assert(this.appWindow.on.calledWithMatch('generator-cancel'));
      assert(this.appWindow.on.calledWithMatch('open-dialog'));
      assert(this.appWindow.on.calledWithMatch('generator:done'));
    });
  });

  describe('#selectTargetDirectory', function () {
    it('open dialog', function () {
      this.appWindow.selectTargetDirectory();

      assert(this.fakeElectron.dialog.showOpenDialog.calledOnce);
    });

    it('open dialog with options', function () {
      var opts = {
        title: 'Select a folder to generate the project into',
        properties: ['openDirectory', 'createDirectory']
      };
      this.appWindow.selectTargetDirectory();

      assert(this.fakeElectron.dialog.showOpenDialog.calledWithMatch(this.appWindow.window, opts));
    });

    xit('send command to the process', function () {
    });
  });

  describe('#initYoProcess', function () {
    it('do not create child process in test mode', function () {
      this.appWindow.loadSettings.isSpec = true;
      this.appWindow.sendCommandToProcess = this.sandbox.stub();
      this.appWindow.initYoProcess();

      assert.equal(this.appWindow.yoProcess, null);
      assert(this.appWindow.sendCommandToProcess.notCalled);
    });
  });

  describe('#emitCommandToAppWindow', function () {
    it('emit events to appWindow with no data', function () {
      this.appWindow.emit = this.sandbox.stub();

      this.appWindow.emitCommandToAppWindow('test');

      assert(this.appWindow.emit.calledOnce);
      assert.equal(this.appWindow.emit.args[0][0], 'test');
    });

    it('emit events to appWindow with data', function () {
      this.appWindow.emit = this.sandbox.stub();

      var data = { foo: 'bar' };
      this.appWindow.emitCommandToAppWindow('test', data);

      assert(this.appWindow.emit.calledWithMatch('test', data));
    });
  });

  describe('#sendCommandToBrowserWindow', function () {
    it('send data to browserWindow through webContents with no arguments', function () {
      var browserWindow = this.appWindow.window;
      this.appWindow.sendCommandToBrowserWindow();

      assert(browserWindow.webContents.send.calledOnce);
      assert(browserWindow.webContents.send.args, [[]]);
    });

    it('send data to browserWindow through webContents with more than one arguments', function () {
      var msg1 = { foo: 'bar' };
      var msg2 = { bar: 'foo' };
      var browserWindow = this.appWindow.window;
      this.appWindow.sendCommandToBrowserWindow('test', msg1, msg2);

      assert(browserWindow.webContents.send.calledWithExactly('test', msg1, msg2));
    });
  });

  xdescribe('#initYoProcess', function () {
  });

  xdescribe('#killYoProcess', function () {
  });

  xdescribe('#sendCommandToProcess', function () {
  });
});
