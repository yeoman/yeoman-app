'use strict';

var Insight;
var crypto = require('crypto');
var querystring = require('querystring');
var _ = require('lodash');
var pkgJson = require('../../../package.json');

module.exports = Insight = function Insight() {};

Insight.sendEvent = function (category, action, label, value) {
  var params;
  params = {
    t: 'event',
    ec: category,
    ea: action
  };
  if (label != null) {
    params.el = label;
  }
  if (value != null) {
    params.ev = value;
  }
  return this.send(params);
};

Insight.init = function (cb) {
  if (getUserId() || Insight.isDisabled()) {
    cb();
  } else {
    createUserId(function (userId) {
      window.localStorage.setItem('insight.userId', userId);
      cb();
    });
  }
};

Insight.isDisabled = function () {
  return window.localStorage.getItem('insight.disabled') === 'true';
};

Insight.enable = function () {
  window.localStorage.setItem('insight.disabled', false);
};

Insight.disable = function () {
  window.localStorage.setItem('insight.disabled', true);
};

Insight.sendTiming = function (category, name, value) {
  var params;
  params = {
    t: 'timing',
    utc: category,
    utv: name,
    utt: value
  };
  return this.send(params);
};

Insight.sendException = function (event) {
  var errorMessage = event;

  if (typeof event !== 'string') {
    errorMessage = event.message;
  }
  errorMessage = stripPath(errorMessage) || 'Unknown';
  errorMessage = errorMessage.replace('Uncaught ', '').slice(0, 150);

  var params = {
    t: 'exception',
    exd: errorMessage,
    exf: '1'
  };

  return this.send(params);
};

Insight.send = function (params) {
  
  if (this.isDisabled()) {
    return;
  }

  _.extend(params, this.defaultParams());
  request('https://www.google-analytics.com/collect?' + (querystring.stringify(params)));
};

Insight.defaultParams = function () {
  // Check out the measurement protocol parameter reference for details.
  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
  return {
    v: 1,
    aip: 1,
    tid: 'UA-40473036-13',
    cid: getUserId(),
    an: pkgJson.name,
    av: pkgJson.version,
    aid: pkgJson.appBundleId,
    ua: window.navigator.userAgent,
    sr: window.screen.availWidth + 'x' + window.screen.availHeight
  };
};

function post (url) {
  var xhr = new window.XMLHttpRequest();
  xhr.open('POST', url);
  xhr.send(null);
}

function request (url) {
  if (window.navigator.onLine) {
    return post(url);
  }
}

function createUserId (cb) {

  function createUUID () {
    return cb(require('node-uuid').v4());
  }

  try {
    return require('getmac').getMac(function (err, macAddress) {
      if (err) {
        createUUID();
      } else {
        cb(crypto.createHash('sha1').update(macAddress, 'utf8').digest('hex'));
      }
    });
  } catch (e) {
    createUUID();
  }
}

function getUserId () {
  return window.localStorage.getItem('insight.userId');
}

function stripPath (message) {
  return message.replace(/'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig, '<path>');
}
