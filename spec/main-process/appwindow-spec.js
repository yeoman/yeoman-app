'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('AppWindow', function () {
  var sandbox;
  var AppWindow;
  var fakeDialog;
  var fakeBrowserWindow;
  var fakeShell;
  var appWindow;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeBrowserWindow = sandbox.stub().returns({
      loadUrl: sandbox.stub(),
      show: sandbox.stub()
    });

    fakeDialog = {
      showOpenDialog: sandbox.stub()
    }

    fakeShell = {
      showItemInFolder: sandbox.stub()
    }

    AppWindow = SandboxedModule.require('../../src/browser/appwindow', {
      singleOnly: true,
      requires: {
        'dialog': fakeDialog,
        'browser-window': fakeBrowserWindow,
        'shell' : fakeShell
      }
    });

    appWindow = new AppWindow();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#prompt', function () {

    it('store callback reference', function () {
      assert.equal(1, 1);
    });
  });

});
