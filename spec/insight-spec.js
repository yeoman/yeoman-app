'use strict';

var Insight = require('../src/renderer/utils/insight.js');

describe('Insight', function () {

  beforeEach(function () {
    window.localStorage.removeItem('insight.disabled');
  });

  describe('.disable()', function () {
    it('sets localStorage insight.disabled to "true" when disable is called', function () {
      Insight.disable();
      expect(window.localStorage.getItem('insight.disabled')).toBe('true');
    });
  });

  describe('.enable()', function () {
    beforeEach(function () {
      window.localStorage.setItem('insight.disabled', 'true');
    });

    it('sets localStorage insight.disabled to "false" when enable is called', function () {
      Insight.enable();
      expect(window.localStorage.getItem('insight.disabled')).toBe('false');
    });
  });

  describe('.isDisabled()', function () {
    it('insight.disabled should be enabled by default', function () {
      expect(Insight.isDisabled()).toBe(false);
    });

    it('returns true when localStorage insight.disabled is set to "true"', function () {
      window.localStorage.setItem('insight.disabled', 'true');
      expect(Insight.isDisabled()).toBe(true);
    });

    it('returns false when localStorage insight.disabled is set to "false"', function () {
      window.localStorage.setItem('insight.disabled', 'false');
      expect(Insight.isDisabled()).toBe(false);
    });
  });
});
