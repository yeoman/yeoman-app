'use strict';

/*
Cache for source code transpiled by babel.

Inspired by https://github.com/atom/atom/blob/6b963a562f8d495fbebe6abdbafbc7caf705f2c3/src/coffee-cache.coffee.
*/

var crypto = require('crypto');
var fs = require('fs-plus');
var path = require('path');
var babel = require('babel-core');

var stats = {
  hits: 0,
  misses: 0
};
var defaultOptions = {
  sourceMap: 'inline',
  reactCompat: true,
  blacklist: ['useStrict'],
  experimental: true,
  optional: ['asyncToGenerator']
};

/*
shasum - Hash with an update() method.
value - Must be a value that could be returned by JSON.parse().
*/
var updateDigestForJsonValue = function(shasum, value) {
  var type = typeof value;
  if (type === 'string') {
    shasum.update('"', 'utf8');
    shasum.update(value, 'utf8');
    shasum.update('"', 'utf8');
  } else if (type === 'boolean' || type === 'number') {
    shasum.update(value.toString(), 'utf8');
  } else if (value === null) {
    shasum.update('null', 'utf8');
  } else if (Array.isArray(value)) {
    shasum.update('[', 'utf8');
    value.forEach(function(item) {
      updateDigestForJsonValue(shasum, item);
      shasum.update(',', 'utf8');
    });

    shasum.update(']', 'utf8');
  } else {
    var keys = Object.keys(value);
    keys.sort();
    shasum.update('{', 'utf8');
    keys.forEach(function(key) {
      updateDigestForJsonValue(shasum, key);
      shasum.update(': ', 'utf8');
      updateDigestForJsonValue(shasum, value[key]);
      shasum.update(',', 'utf8');
    });

    shasum.update('}', 'utf8');
  }
};

var createBabelVersionAndOptionsDigest = function(version, options) {
  var shasum = crypto.createHash('sha1');
  shasum.update('babel-core', 'utf8');
  shasum.update('\0', 'utf8');
  shasum.update(version, 'utf8');
  shasum.update('\0', 'utf8');
  updateDigestForJsonValue(shasum, options);
  return shasum.digest('hex');
};

var cacheDir = path.join(fs.absolute('~/.atom'), 'compile-cache');
var jsCacheDir = path.join(cacheDir, createBabelVersionAndOptionsDigest(babel.version, defaultOptions), 'js');

var getCachePath = function(sourceCode) {
  var digest = crypto.createHash('sha1').update(sourceCode, 'utf8').digest('hex');
  return path.join(jsCacheDir, digest + '.js');
};

var getCachedJavaScript = function(cachePath) {
  var cachedJavaScript;
  if (fs.isFileSync(cachePath)) {
    try {
      cachedJavaScript = fs.readFileSync(cachePath, 'utf8');
      stats.hits++;
      return cachedJavaScript;
    } catch (_e) {}
  }

  return null;
};

var createOptions = function(filePath) {
  var key;
  var options = {
    filename: filePath
  };
  for (key in defaultOptions) {
    options[key] = defaultOptions[key];
  }

  return options;
};

var loadFile = function(module, filePath) {
  var sourceCode = fs.readFileSync(filePath, 'utf8');
  if (!/^("use 6to5"|'use 6to5'|"use babel"|'use babel')/.test(sourceCode)) {
    module._compile(sourceCode, filePath);
    return;
  }

  var cachePath = getCachePath(sourceCode);
  var js = getCachedJavaScript(cachePath);
  if (!js) {
    var options = createOptions(filePath);
    try {
      js = babel.transform(sourceCode, options).code;
      stats.misses++;
    } catch (error) {
      console.error('Error compiling %s: %o', filePath, error);
      throw error;
    }

    try {
      fs.writeFileSync(cachePath, js);
    } catch (error) {
      console.error('Error writing to cache at %s: %o', cachePath, error);
      throw error;
    }
  }

  return module._compile(js, filePath);
};

var register = function() {
  Object.defineProperty(require.extensions, '.js', {
    writable: false,
    value: loadFile
  });
};

module.exports = {
  register: register,
  getCacheMisses: function() {
    return stats.misses;
  },

  getCacheHits: function() {
    return stats.hits;
  },

  createBabelVersionAndOptionsDigest: createBabelVersionAndOptionsDigest
};
