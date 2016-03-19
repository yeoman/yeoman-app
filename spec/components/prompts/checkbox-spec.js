import createComponent from '../../helpers/createComponent.js';
import CheckboxPrompt from '../../../src/renderer/components/prompts/checkbox.jsx';

describe('CheckboxPrompt', function () {
  let tree;
  let renderOutput;
  let labelComponent;
  let checkboxList;
  const mockChoices = [
    {
      name: 'Lorem',
      value: 'a'
    },
    {
      name: 'Ipsum',
      value: 'b'
    }
  ];

  beforeEach(function () {
    tree = createComponent(CheckboxPrompt, {
      type: 'checkbox',
      name: 'checkbox-prompt',
      color: '#dd002a',
      message: 'Select a bunch of stuff',
      defaultAnswer: ['b'],
      choices: mockChoices
    });
    renderOutput = tree.getRenderOutput();

    labelComponent = renderOutput.props.children[0];
    checkboxList = renderOutput.props.children[1];
  });

  describe('label', function () {
    it('pass options to the component', function () {
      expect(labelComponent.props.message).toBe('Select a bunch of stuff');
      expect(labelComponent.props.color).toBe('#dd002a');
    });
  });

  describe('checkbox list', function () {
    it('container gets the correct info', function () {
      expect(checkboxList.type).toBe('div');
      expect(checkboxList.props.children.length).toBe(mockChoices.length);
    });
    it('checkbox items gets correct info', function () {
      mockChoices.forEach((item, index) => {
        expect(checkboxList.props.children[index].props.label).toBe(item.name);
        expect(checkboxList.props.children[index].props.value).toBe(item.value);
      });
    });
    it('default value should be checked', function () {
      expect(tree.subTree('Checkbox', node => node.props.value === 'b').props.defaultChecked).toBe(true);
    });
  });

});

