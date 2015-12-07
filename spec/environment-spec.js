var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');
var _ = require('underscore-plus');

describe('environment', function () {
  var sandbox;
  var fakeEnvironment;
  var fakeAdapter;
  var fakeFixPath;
  var yoEnv;

  function reloadEnvironment(platform, env) {
    return SandboxedModule.require('../src/browser/yo/environment', {
      singleOnly: true,
      requires: {
        'yeoman-environment': fakeEnvironment,
        'fix-path': fakeFixPath,
        './adapter': fakeAdapter
      },
      globals: {
        process: {
          env: _.extend({ PATH: '/some/node/path' }, env || {}),
          platform: platform
        }
      }
    });
  }

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeEnvironment = {
      createEnv: sandbox.stub().returns(sandbox.stub)
    };
    fakeAdapter = sandbox.stub();
    fakeFixPath = sandbox.stub();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor', function () {
    beforeEach(function () {
      yoEnv = reloadEnvironment();
    });

    it('call #createEnv()', function () {
      yoEnv();
      assert.equal(fakeEnvironment.createEnv.callCount, 1);
    });

    it('take arguments parameter and pass it to yeoman-environment', function () {
      var args = ['aloha'];
      yoEnv(args);
      assert.equal(fakeEnvironment.createEnv.args[0][0], args);
    });

    it('take options parameter and pass it to yeoman-environment', function () {
      var options = { aloha: 'ahiahi' };
      yoEnv([], options);
      assert.equal(fakeEnvironment.createEnv.args[0][1], options);
    });

    it('instantiates the GUI adapter', function () {
      yoEnv();
      assert.equal(fakeAdapter.callCount, 1);
    });
  });

  describe('#getNpmPaths', function () {
    it('call npm module fix-path', function () {
      yoEnv = reloadEnvironment();
      yoEnv().getNpmPaths();

      assert.equal(fakeFixPath.callCount, 1);
    });

    // it('append default NPM dir for darwin', function () {
    //   yoEnv = reloadEnvironment('darwin');
    //   var paths = yoEnv().getNpmPaths();

    //   assert.deepEqual(paths, [
    //     '/usr/lib/node_modules',
    //     '/some/node/lib/node_modules'
    //   ]);
    // });

    // it('append default NPM dir for win32', function () {
    //   yoEnv = reloadEnvironment('win32', { APPDATA: '/some/node/path' });
    //   var paths = yoEnv().getNpmPaths();

    //   assert.deepEqual(paths, [
    //     '/some/node/path/npm/node_modules',
    //     '/some/node/lib/node_modules'
    //   ]);
    // });
  });
});
