import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Toolbar from './Toolbar';

const styles = {
  container: {
    paddingTop: 0,
  }
};

const muiTheme = getMuiTheme();

export default class Layout extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Toolbar />
          <div id="container">{this.props.children}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}
