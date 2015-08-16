var header = document.createElement('header');
document.body.appendChild(header);

var main = document.createElement('main');
main.id = 'content';
document.body.appendChild(main);

var style = document.createElement('link');
style.rel = 'stylesheet/less';
style.type = 'text/css';
style.href = 'less/main.less';
document.head.appendChild(style);

var lessCompiler = document.createElement('script');
lessCompiler.src = '../node_modules/less/dist/less.js';
document.body.appendChild(lessCompiler);

// Array.prototype.findIndex polyfill, we can remove this as soon as Chrome starts supporting it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
require('array.prototype.findindex');

require('./utils/insight').init(function () {
  // React entry-point
  const Root = require('./containers/root.jsx');

  React.render(<Root />, document.getElementById('content'));
});
