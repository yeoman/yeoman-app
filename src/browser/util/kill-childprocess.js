var psTree = require('ps-tree');

module.exports = function kill(pid, signal, cb) {
  if (!pid) {
    throw new Error('You must provide pid to kill.');
  }

  if (typeof signal === 'function') {
    cb = signal;
    signal = null;
  }

  if (!cb) {
    throw new Error('You must provide a callback function.');
  }

  signal = signal || 'SIGKILL';

  psTree(pid, function (err, children) {
    if (err) {
      return cb(err);
    }

    children.forEach(function (child) {
      process.kill(child.PID, signal);
    });
    process.kill(pid, signal);

    cb(null);
  });
};
