import createComponent from '../../helpers/createComponent.js';
import InputPrompt from '../../../src/renderer/components/prompts/input.jsx';

describe('InputPrompt', function () {
  let tree;
  let renderOutput;
  let labelComponent;
  let inputComponent;

  beforeEach(function () {
    tree = createComponent(InputPrompt, {
      defaultAnswer: 'Sushi',
      type: 'input',
      name: 'food',
      color: '#dd002a',
      message: 'What is your favourite food'
    });
    renderOutput = tree.getRenderOutput();

    labelComponent = renderOutput.props.children[0];
    inputComponent = renderOutput.props.children[1];

  });

  describe('label', function () {
    it('pass options to the component', function () {
      expect(labelComponent.props.message).toBe('What is your favourite food');
      expect(labelComponent.props.color).toBe('#dd002a');
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
