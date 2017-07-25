import React, { Component } from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toggle from "material-ui/Toggle";
import { Card, CardTitle, CardText } from "material-ui/Card";

const styles = {
  block: {
    maxWidth: 450
  },
  container: {
    paddingTop: 0
  },
  toggle: {
    marginBottom: 16
  },
  thumbSwitched: {
    backgroundColor: "#9CCC65"
  },
  trackSwitched: {
    backgroundColor: "#DCEDC8"
  },
  labelStyle: {
    color: "#9CCC65"
  }
};

const muiTheme = getMuiTheme();

export default class SettingsPage extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Card>
          <CardTitle title="Settings" subtitle="" />
          <CardText>
            <div id="endpointSettings">
              <div style={styles.block}>
                <Toggle
                  label="Allow slot validator for /api/slots/generator endpoint "
                  thumbSwitchedStyle={styles.thumbSwitched}
                  trackSwitchedStyle={styles.trackSwitched}
                  labelPosition="right"
                />
              </div>
            </div>
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
}
