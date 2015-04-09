'use strict';

var React = require('react');
var RaisedButton = require('material-ui/src/js/raised-button.jsx');
var classSet = require('react/addons').addons.classSet;

var PromptMixin = require('./prompt-mixin');


var ConfirmPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onClickNo: function (event) {
    this.setState({
      answer: false
    });
    event.preventDefault();
  },

  _onClickYes: function (event) {
    this.setState({
      answer: true
    });
    event.preventDefault();
  },

  render: function () {

    var classesButtonNo = classSet({
      'confirm-button': true,
      'button-no': true,
      'active': !this.state.answer
    });

    var classesButtonYes = classSet({
      'confirm-button': true,
      'button-yes': true,
      'active': this.state.answer
    });

    return (
      <fieldset className="confirm-prompt">
        <label style={{ background: this.props.color }}>{this.props.message}</label>
        <div className="confirm-options">
          <RaisedButton
            className={classesButtonNo}
            label="No"
            onClick={this._onClickNo}
          />
          <RaisedButton
            className={classesButtonYes}
            label="Yes"
            onClick={this._onClickYes}
          />
        </div>
      </fieldset>
    );
  }

});


module.exports = ConfirmPrompt;

