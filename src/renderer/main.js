
import insight from './utils/insight';
import { render } from 'react-dom';
import Root from './containers/root.jsx';

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

insight.init(function () {
  // React entry-point

  render(<Root />, document.getElementById('content'));
});
