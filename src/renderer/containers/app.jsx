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

let themeManager = mui.Styles.ThemeManager;

const App = React.createClass({
  displayName: 'App',

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: themeManager.getMuiTheme(mui.Styles.LightRawTheme)
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
              generators={generators}
              gridItemSelected={gridActions.gridItemSelected} />
          </div>
        </div>
        <div className="content" style={promptContainerStyle}>
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
        <CompatibilityWarning
          active={selectedGenerator.isCompatible}
          linkClicked={compatibilityWarningActions.linkClicked} />
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
