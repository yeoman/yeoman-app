'use strict';

var createComponent = require('../helpers/createComponent.js');
var PromptFrom = require('../../src/renderer/components/prompts/input.jsx');

describe('InputPrompt', function () {
  var renderOutput;
  var labelComponent;
  var inputComponent;

  beforeEach(function () {
    renderOutput = createComponent(PromptFrom, {
      defaultAnswer: 'Sushi',
      type: 'input',
      name: 'food',
      color: '#dd002a',
      message: 'What is your favourite food'
    });

    labelComponent = renderOutput.props.children[0];
    inputComponent = renderOutput.props.children[1];

  });

  describe('label', function () {
    it('pass options to the component', function () {
      expect(labelComponent.props.children).toBe('What is your favourite food');
      expect(labelComponent.props.htmlFor).toBe('food');
      expect(labelComponent.props.style.background).toBe('#dd002a');
    });
  });

  describe('input', function () {
    it('pass options to the component', function () {
      expect(inputComponent.props.type).toBe('input');
      expect(inputComponent.props.name).toBe('food');
      expect(inputComponent.props.value).toBe('Sushi');
    });
  });
});
