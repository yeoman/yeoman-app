import createComponent from '../../helpers/createComponent.js';
import ConfirmPrompt from '../../../src/renderer/components/prompts/confirm.jsx';
import styles from '../../../src/renderer/styles/components/prompts/confirm';

describe('ConfirmPrompt', function () {
  let tree;
  let renderOutput;
  let labelComponent;
  let confirmButtons;

  describe('no default answer', function () {
    beforeEach(function () {
      tree = createComponent(ConfirmPrompt, {
        type: 'confirm',
        name: 'confirm-prompt',
        color: '#dd002a',
        message: 'Do you want to do some stuff?'
      });
      renderOutput = tree.getRenderOutput();

      labelComponent = renderOutput.props.children[0];
      confirmButtons = renderOutput.props.children[1];
    });

    describe('label', function () {
      it('pass options to the component', function () {
        expect(labelComponent.props.message).toBe('Do you want to do some stuff?');
        expect(labelComponent.props.color).toBe('#dd002a');
      });
    });

    describe('confirm buttons', function () {
      it('container gets the correct info', function () {
        expect(confirmButtons.type).toBe('div');
        expect(confirmButtons.props.children.length).toBe(2);
      });
      it('confirm buttons have correct labelling', function () {
        expect(confirmButtons.props.children[0].props.label).toBe('No');
        expect(confirmButtons.props.children[1].props.label).toBe('Yes');
      });
    });
  });
  describe('yes is selected by default', function () {
    beforeEach(function () {
      tree = createComponent(ConfirmPrompt, {
        type: 'confirm',
        name: 'confirm-prompt',
        color: '#dd002a',
        defaultAnswer: true,
        message: 'Do you want to do some stuff?'
      });
      renderOutput = tree.getRenderOutput();
      confirmButtons = renderOutput.props.children[1];
    });
    it('yes button to be active', function () {
      expect(confirmButtons.props.children[1].props.labelStyle).toBe(styles.yesActive);
    });
  });
  describe('no is selected by default', function () {
    beforeEach(function () {
      tree = createComponent(ConfirmPrompt, {
        type: 'confirm',
        name: 'confirm-prompt',
        color: '#dd002a',
        defaultAnswer: false,
        message: 'Do you want to do some stuff?'
      });
      renderOutput = tree.getRenderOutput();
      confirmButtons = renderOutput.props.children[1];
    });
    it('no button to be active', function () {
      expect(confirmButtons.props.children[0].props.labelStyle).toBe(styles.noActive);
    });
  });
});

