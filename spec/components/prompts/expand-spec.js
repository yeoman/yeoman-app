import createComponent from '../../helpers/createComponent.js';
import ExpandPrompt from '../../../src/renderer/components/prompts/expand.jsx';

describe('ExpandPrompt', function () {
  let tree;
  let renderOutput;
  let labelComponent;
  let radioButtonsContainer;
  let radioButtons;
  const mockChoices = [
    {
      name: 'Lorem',
      value: 'a'
    },
    {
      name: 'Ipsum',
      value: 'b'
    },
    {
      name: 'Dolor',
      value: 'c'
    },
    {
      name: 'Sit',
      value: 'd'
    }
  ];

  describe('no default answer', function () {
    beforeEach(function () {
      tree = createComponent(ExpandPrompt, {
        type: 'expand',
        name: 'expand-prompt',
        color: '#dd002a',
        message: 'Select an option',
        choices: mockChoices
      });
      renderOutput = tree.getRenderOutput();

      labelComponent = renderOutput.props.children[0];
      radioButtonsContainer = renderOutput.props.children[1];
      radioButtons = radioButtonsContainer.props.children;
    });

    describe('label', function () {
      it('pass options to the component', function () {
        expect(labelComponent.props.message).toBe('Select an option');
        expect(labelComponent.props.color).toBe('#dd002a');
      });
    });

    describe('radio buttons', function () {
      it('container gets the correct info', function () {
        expect(radioButtonsContainer.type).toBe('div');
        expect(radioButtons.props.children.length).toBe(4);
      });
      it('radio buttons have correct labelling', function () {
        mockChoices.forEach((item, index) => {
          expect(radioButtons.props.children[index].props.label).toBe(item.name);
        });
      });
      it('radio buttons have correct values', function () {
        mockChoices.forEach((item, index) => {
          expect(radioButtons.props.children[index].props.value).toBe(item.value);
        });
      });
    });
  });
  describe('value is selected by default', function () {
    beforeEach(function () {
      tree = createComponent(ExpandPrompt, {
        type: 'expand',
        name: 'expand-prompt',
        color: '#dd002a',
        message: 'Select an option',
        choices: mockChoices,
        defaultAnswer: 'c'
      });
      renderOutput = tree.getRenderOutput();
      radioButtonsContainer = renderOutput.props.children[1];
      radioButtons = radioButtonsContainer.props.children;
    });
    it('c radio button should be active', function () {
      expect(radioButtons.props.defaultSelected).toBe('c');
    });
  });
});

