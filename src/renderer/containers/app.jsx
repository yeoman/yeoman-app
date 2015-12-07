import React from 'react';
import classSet from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import mui from 'material-ui';

import CompatibilityWarning from '../components/compatibility-warning.jsx';
import Grid from '../components/grid.jsx';
import PromptForm from '../components/prompt-form.jsx';

import * as GridActions from '../actions/grid-actions';
import * as CompatibilityWarningActions from '../actions/compatibility-warning-actions';
import * as PromptFormActions from '../actions/prompt-form-actions';

let themeManager = new mui.Styles.ThemeManager();
themeManager.setTheme(themeManager.types.LIGHT);

const App = React.createClass({
  displayName: 'App',

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: themeManager.getCurrentTheme()
    };
  },

  render() {

    const { generator, selectedFolder, dispatch } = this.props;
    const {
      generators,
      selectedGenerator,
      actualFormType,
      questions,
      isLoading
    } = generator;

    const filter = (g) => g.name.indexOf('inair') > -1;

    const gridActions = bindActionCreators(GridActions, dispatch);
    const compatibilityWarningActions = bindActionCreators(CompatibilityWarningActions, dispatch);

    const gridClasses = classSet('grid', {
      desactive: selectedGenerator.name
    });

    const promptContainerStyle = {
      display: selectedGenerator.name ? 'block' : 'none'
    };

    const preloaderStyle = {
      width: 100,
      height: 100,
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: -50,
      marginTop: -50,
      display: isLoading ? 'block' : 'none'
    };

    return (
      <section>
        <div className="grid-wrap">
          <div id="generators-grid" className={gridClasses}>
            <Grid
              selectedGenerator={selectedGenerator}
              generators={generators && generators.filter(filter)}
              gridItemSelected={gridActions.gridItemSelected} />
          </div>
        </div>
        <div className="content" style={promptContainerStyle}>
          <CompatibilityWarning
            active={selectedGenerator.isCompatible}
            linkClicked={compatibilityWarningActions.linkClicked} />
          <img style={preloaderStyle} src="img/rings.svg" />
          <PromptForm
            generator={selectedGenerator}
            questions={questions}
            type={actualFormType}
            selectedFolder={selectedFolder}
            selectFolder={PromptFormActions.selectFolder}
            submitSelectedFolder={PromptFormActions.submitSelectedFolder}
            submitForm={PromptFormActions.submitForm}
          />
        </div>
      </section>
    );
  }
});

function select(state) {
  return {
    generator: state.generator,
    selectedFolder: state.prompt
  };
}

export default connect(select)(App);
