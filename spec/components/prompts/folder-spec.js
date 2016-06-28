import createComponent from '../../helpers/createComponent.js';
import FolderPrompt from '../../../src/renderer/components/prompts/folder.jsx';

describe('FolderPrompt', function () {
  let tree;
  let renderOutput;
  let labelComponent;
  let folderElements;
  let folderButton;
  let folderName;

  beforeEach(function () {
    tree = createComponent(FolderPrompt, {
      name: 'folder-prompt',
      color: '#dd002a',
      message: 'Select a folder to generate the project into',
      selectedFolder: '/home/username/tmp',
      selectFolder: require('lodash').noop
    });
    renderOutput = tree.getRenderOutput();

    labelComponent = renderOutput.props.children[0];
    folderElements = renderOutput.props.children[1];
    folderButton = folderElements.props.children[0];
    folderName = folderElements.props.children[1];
  });

  describe('label', function () {
    it('pass options to the component', function () {
      expect(labelComponent.props.message).toBe('Select a folder to generate the project into');
      expect(labelComponent.props.color).toBe('#dd002a');
    });
  });

  describe('folder elements', function () {
    it('container gets the correct info', function () {
      expect(folderElements.type).toBe('div');
      expect(folderElements.props.className).toBe('prompt-elements');
      expect(folderElements.props.children.length).toBe(2);
    });
    it('button gets correct info', function () {
      expect(folderButton.props.label).toBe('Select a folder');
    });
    it('folder name gets correct info', function () {
      expect(folderName.type).toBe('span');
      expect(folderName.props.children).toBe('/home/username/tmp');
    });
  });
});

