import React, { Component } from "react";
import { connect } from "react-redux";
import { allowSlotValidator, disallowSlotValidator } from "../actions";
import { getStateAllowSlotValidator, getProgressSettings } from "../reducers";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toggle from "material-ui/Toggle";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import Favorite from "material-ui/svg-icons/action/favorite";
import AlertError from "material-ui/svg-icons/alert/error";
import { lightGreen400, red400 } from "material-ui/styles/colors";

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

const iconStyles = {
  marginRight: 24
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
          <CardActions>
            <div style={styles.block} id="allertSettings">
              {this.props.getProgressSettings.showProgress === true &&
                <div>
                  {this.props.getProgressSettings.state === true &&
                    <div id="allertSettingsSuccess">
                      <Favorite style={iconStyles} color={lightGreen400} />{" "}
                      {this.props.getProgressSettings.message}
                    </div>}
                  {this.props.getProgressSettings.state === false &&
                    <div id="allertSettingsFailed">
                      <AlertError style={iconStyles} color={red400} />
                    </div>}
                </div>}
            </div>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    );
  }
};

const mapStateToProps = state => ({
  getStateAllowSlotValidator: getStateAllowSlotValidator(state),
  getProgressSettings: getProgressSettings(state)
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
