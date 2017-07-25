import React, { Component } from "react";
import { connect } from "react-redux";
import { allowSlotValidator, disallowSlotValidator } from "../actions";
import { getStateAllowSlotValidator } from "../reducers";
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

const SettingsPage = class SettingsPage extends Component {
  handleToggle = (event, isInputChecked) => {
    if (this.props.getStateAllowSlotValidator) {
      this.props.disallowSlotValidator();
      this.props.saveSettings({ allowSlotValidator: false });
    } else {
      this.props.allowSlotValidator();
      this.props.saveSettings({ allowSlotValidator: true });
    }
  };

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
                  toggled={this.props.getStateAllowSlotValidator}
                  onToggle={
                    (
                      event,
                      isInputChecked => this.handleToggle(event, isInputChecked)
                    )
                  }
                />
              </div>
            </div>
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
};

const mapStateToProps = state => ({
  getStateAllowSlotValidator: getStateAllowSlotValidator(state)
});

const mapDispatchToProps = dispatch => {
  return {
    allowSlotValidator: () => {
      dispatch(allowSlotValidator());
    },
    disallowSlotValidator: () => {
      dispatch(disallowSlotValidator());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
