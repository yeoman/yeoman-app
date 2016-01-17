import CheckboxPrompt from '../prompts/checkbox.jsx';
import ConfirmPrompt from '../prompts/confirm.jsx';
import ExpandPrompt from '../prompts/expand.jsx';
import FolderPrompt from '../prompts/folder.jsx';
import InputPrompt from '../prompts/input.jsx';
import ListPrompt from '../prompts/list.jsx';


export default {

  renderQuestion(question) {
    const {
      generator: { color }
    } = this.props;

    if (!question.type) {
      question.type = 'input';
    }

    switch (question.type) {
      case 'string':
      case 'input':
      case 'password':
        return (
          <InputPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            type={question.type}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      case 'confirm':
        return (
          <ConfirmPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      case 'folder':
        return (
          <FolderPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
            selectedFolder={this.props.selectedFolder}
            selectFolder={this.props.selectFolder}
          />
        );
      case 'list':
        return (
          <ListPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />
        );
      case 'expand':
        return (
          <ExpandPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default || question.choices[0].value}
            color={color}
          />
        );
      case 'checkbox':
        return (
          <CheckboxPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default}
            color={color}
          />
        );
      default:
        return <span key={question.name} />;
    }
  }
};

