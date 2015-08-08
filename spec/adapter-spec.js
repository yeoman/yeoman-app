'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('Adapter', function () {
  var sandbox;
  var ProcessAdapter;
  var adapter;
  var processSendStub;
  var fakeLogStub;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    processSendStub = sandbox.stub();
    fakeLogStub = sandbox.stub();

    ProcessAdapter = SandboxedModule.require('../src/browser/yo/adapter', {
      requires: {
        'yeoman-environment/lib/util/log': fakeLogStub
      },
      globals: {
        process: {
          send: processSendStub
        }
      }
    });

    adapter = new ProcessAdapter();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#prompt', function () {
    it('send a "generator:prompt-questions" ipc message when prompt was called', function () {
      adapter.prompt('data', sandbox.stub());

      assert.equal(processSendStub.callCount, 1);
      assert.equal(processSendStub.args[0][0].event, 'generator:prompt-questions');
    });

    it('send questions along with ipc message when prompt was called', function () {
      var questions = [{
        message: 'What is your favourite food'
      }];

      adapter.prompt(questions, sandbox.stub());
      assert.deepEqual(processSendStub.args[0][0].data, questions);
    });

    it('store callback reference', function () {
      var callbackStub = sandbox.stub();
      adapter.prompt('data', callbackStub);
      adapter.answerCallback();

      assert.equal(callbackStub.callCount, 1);
    });
  });

  describe('#diff', function () {
    it('send a "generator:diff" ipc message when diff was called', function () {
      adapter.diff('foooo', 'foo');

      assert.equal(processSendStub.callCount, 1);
      assert.equal(processSendStub.args[0][0].event, 'generator:diff');
    });

    it('send diff object along with ipc message when diff was called', function () {
      adapter.diff('foooo', 'foo');

      assert.equal(processSendStub.args[0][0].data.actual, 'foooo');
      assert.equal(processSendStub.args[0][0].data.expected, 'foo');
    });
  });

  describe('#log', function () {
    it('implements log utility from yeoman-environment', function () {
      assert.equal(fakeLogStub.callCount, 1);
    });
  });

});
