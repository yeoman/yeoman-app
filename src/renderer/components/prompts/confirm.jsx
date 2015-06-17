'use strict';

var React = require('react');
var mui = require('material-ui');

var classSet = require('classnames');

var PromptMixin = require('./prompt-mixin');

var RaisedButton = mui.RaisedButton;


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
      <div className="confirm-prompt fieldset">
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
      </div>
    );
  }

});


module.exports = ConfirmPrompt;

