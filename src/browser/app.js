import yargs from 'yargs';
import application from './application';

const shellStartTime = Date.now();

process.on('uncaughtException', (error) => {
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

application(parseCommandLine());

console.log('App load time: ' + (Date.now() - shellStartTime) + 'ms');

function parseCommandLine() {
  const options = yargs(process.argv.slice(1)).wrap(100);

  options.alias('t', 'test').boolean('t').describe('t', 'Run the specs and exit with error code on failures.');

  const argv = options.argv;

  return {
    test: argv.test
  };
}
