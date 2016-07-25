
import insight from './utils/insight';
import { render } from 'react-dom';
import Root from './containers/root.jsx';

const header = document.createElement('header');
Object.assign(header.style, {
  background: '#FFDE00 url("./img/header.png") no-repeat scroll top center',
  width: '100%',
  height: '300px',
  webkitAppRegion: 'drag',
  boxShadow: '0px 15px 100px -20px rgba(0,0,0,0.5)',
  position: 'fixed',
  top: '0',
  zIndex: '10'
});
document.body.appendChild(header);

var main = document.createElement('main');
Object.assign(main.style, {
  marginTop: '330px',
  position: 'absolute'
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
