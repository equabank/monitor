import React, { Component } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const styles = {
  container: {
    paddingTop: 0
  }
};

const muiTheme = getMuiTheme();

export default class AboutPage extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <div id="aboutPage">
            <h1>Monitor 0.1.4</h1>
            <ul>
              <li>
                <a href="https://github.com/test-stack/monitor" target="_blank">
                  Github repository
                </a>
              </li>
              <li>
                <a
                  href="https://hub.docker.com/r/rdpanek/monitor/"
                  target="_blank"
                >
                  Docker image
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/test-stack/monitor/blob/develop/README.md"
                  target="_blank"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
