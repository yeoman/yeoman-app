'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('Adapter', function () {
  var sandbox;
  var ProcessAdapter;
  var adapter;
  var processSendStub;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    processSendStub = sandbox.stub();
    ProcessAdapter = SandboxedModule.require('../../src/browser/yo/adapter', {
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

});
