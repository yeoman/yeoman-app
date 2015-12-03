var yargs = require('yargs');

var shellStartTime = Date.now();

var logger = require('./logger')

process.on('uncaughtException', function (error) {
  if (!error) {
    error = {};
  }
  if (error.message) {
    console.error(error.message);
  }
  if (error.stack) {
    console.error(error.stack);
  }
});

var args = parseCommandLine();
require('./application')(args);

console.log('App load time: ' + (Date.now() - shellStartTime) + 'ms');

function parseCommandLine() {
  var options = yargs(process.argv.slice(1)).wrap(100);

  options.alias('t', 'test').boolean('t').describe('t', 'Run the specs and exit with error code on failures.');

  var argv = options.argv;

  return {
    test: argv.test
  };
}
