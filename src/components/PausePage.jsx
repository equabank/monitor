import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    paddingTop: 0,
  }
};

const muiTheme = getMuiTheme();

export default class PausePage extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <div id="pausePage">
            <h1>Oops!</h1>
            <h2>
              Time slot isn't available.
            </h2>
            <p>
              
            </p>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
