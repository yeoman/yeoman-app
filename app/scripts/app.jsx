'use strict';

var React = require('react');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

var App = React.createClass({
  render: function () {
    return (
      <div className='main'>
        <h1>Hello world</h1>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('testambre'));

module.exports = App;

