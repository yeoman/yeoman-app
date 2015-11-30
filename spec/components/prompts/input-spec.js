import createComponent from '../../helpers/createComponent.js';
import InputPrompt from '../../../src/renderer/components/prompts/input.jsx';

describe('InputPrompt', function () {
  let renderOutput;
  let labelComponent;
  let inputComponent;

  beforeEach(function () {
    renderOutput = createComponent(InputPrompt, {
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
