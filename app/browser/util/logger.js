'use strict';

var fs = require('fs');
var path = require('path');
var app = require('app');
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var argv = require('minimist')(process.argv);

// Bunyan is a simple and fast JSON logging library.
// Please take a closer look to the readme and sample
//  to see how Bunyan works and how powerful it is.
// https://github.com/trentm/node-bunyan

// A "stream" is Bunyan's name for an output for log messages.
// https://github.com/trentm/node-bunyan#streams
var streams = [];

// Pipe the logs in a file. The file is located in the
// applications configuration directory.
var logPath = path.join(app.getDataPath(), 'yoapp.log');
streams.push({
  level: argv.loglevel || bunyan.INFO,
  path: logPath
});

// Clean up log file.
// TODO: Implement rotating file
// https://github.com/trentm/node-bunyan#stream-type-rotating-file
if (fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, '');
}

// Pipe the logs to the console.
// Start the app with the `--debug` argument to
// enable the debug mode.
if (argv.debug) {

  // Prettify the stream for the console
  var prettyStdOut = new PrettyStream({
    useColor: true
  });
  prettyStdOut.pipe(process.stdout);

  streams.push({
    level: argv.loglevel || bunyan.TRACE,
    type: 'raw',
    stream: prettyStdOut
  });
}

module.exports = function(name) {
  var log = bunyan.createLogger({

    // Give the logger the app name.
    name: app.getName() + ' ' + name,

    // Log the source file, line and function name.
    // Therfore you should use named function
    // https://github.com/trentm/node-bunyan#src
    src: true,

    // Add the outputsgst
    streams: streams
  });

  // Advanced logging for our devs. Log logger errors.
  if (argv.debug) {
    log.on('error', function (err) {
        console.warn('An error in bunyan occurred:', err);
    });
  }
  return log;
};
