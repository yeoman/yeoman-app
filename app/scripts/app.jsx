'use strict';

var React = require('react');

var Grid = require('./components/grid.jsx');
var PromptForm = require('./components/prompt-form.jsx');

// Starts communication channel with atom-shell browser side
require('./utils/browser-utils');
// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;


var App = React.createClass({

  render: function () {
    return (
      <section className="grid3d vertical" id="grid3d">
        <div className="grid-wrap">
          <div className="hi">
            <img className="yeoman-hi" src="img/yeoman-hi.png" />
            <h1>Welcome to Yeoman, ladies and gentleman!</h1>
            <p>We are here to improve your workflow and help you develop modern webapps. No more copy and paste.</p>
            <p>Go ahead and choose any of the options below to scaffold your next amazing application!</p>
          </div>
          <div id="generators-grid" className="grid">
            <Grid />
          </div>
        </div>
        <div className="content">
          <PromptForm />
          <span className="loading"></span>
          <span className="icon close-content"></span>
        </div>
      </section>
    );
  }

});

React.render(<App />, document.getElementById('content'));


module.exports = App;

