/*global React*/

const header = document.createElement('header');
Object.assign(header.style, {
  background: '#FFDE00 url("./img/header.png") no-repeat scroll top center',
  width: '100%',
  height: '300px'
});
document.body.appendChild(header);

var main = document.createElement('main');
Object.assign(main.style, {
  marginTop: '45px'
});
main.id = 'content';
document.body.appendChild(main);

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = 'fonts.css';
document.head.appendChild(style);

// Array.prototype.findIndex polyfill, we can remove this as soon as Chrome starts supporting it
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
require('array.prototype.findindex');

require('./utils/insight').init(function () {
  // React entry-point
  const Root = require('./containers/root.jsx');

  React.render(<Root />, document.getElementById('content'));
});
