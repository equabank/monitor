import React, { Component } from "react";
import { connect } from "react-redux";
import {
  allowSlotValidator,
  disallowSlotValidator,
  toogleMessageBox
} from "../actions";
import {
  getStateAllowSlotValidator,
  getProgressSettings,
  getMessageBoxSettings
} from "../reducers";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toggle from "material-ui/Toggle";
import TextField from "material-ui/TextField";
import Slider from "material-ui/Slider";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import Favorite from "material-ui/svg-icons/action/favorite";
import FavoriteBorder from "material-ui/svg-icons/action/favorite-border";
import AlertError from "material-ui/svg-icons/alert/error";
import Info from "material-ui/svg-icons/action/info";
import InfoOutline from "material-ui/svg-icons/action/info-outline";
import Warning from "material-ui/svg-icons/alert/warning";
import { lightGreen400, red400 } from "material-ui/styles/colors";
import Moment from "moment";

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
  },
  radioButton: {
    marginBottom: 16
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

  handleChangeMessageBoxMessage = event => {
    this.props.toogleMessageBox({
      message: event.target.value,
      color: this.props.getProgressSettings.color,
      endTime: this.props.getMessageBoxSettings.endTime
    });
  };

  handleChangeMessageBoxDuration = (event, value) => {
    this.props.toogleMessageBox({
      message: this.props.getProgressSettings.message,
      color: this.props.getProgressSettings.color,
      endTime: Moment().add(value, "seconds").format("HH:mm:ss")
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
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
                        isInputChecked =>
                          this.handleToggle(event, isInputChecked)
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
                        <Favorite
                          style={iconStyles}
                          color={lightGreen400}
                        />{" "}
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

          <Card>
            <CardTitle title="Message Banner" subtitle="" />
            <CardText>
              <div id="messageBannerBox">
                <div id="messageBoxTextarea">
                  <TextField
                    hintText="Message"
                    multiLine={true}
                    rows={2}
                    rowsMax={8}
                    fullWidth={true}
                    value={this.props.getMessageBoxSettings.message}
                    onChange={this.handleChangeMessageBoxMessage}
                  />
                </div>
                <br />
                <br />
                <div id="messageBoxColor">
                  <div>
                    <RadioButtonGroup
                      name="shipSpeed"
                      defaultSelected="not_light"
                    >
                      <RadioButton
                        value="notice"
                        label="Notice message"
                        checkedIcon={<Info />}
                        uncheckedIcon={<InfoOutline />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#29B6F6" }}
                      />
                      <RadioButton
                        value="warning"
                        label="Warning message"
                        checkedIcon={<Warning />}
                        uncheckedIcon={<Warning />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#EF5350" }}
                      />
                      <RadioButton
                        value="success"
                        label="Success message"
                        checkedIcon={<Favorite />}
                        uncheckedIcon={<FavoriteBorder />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#9CCC65" }}
                      />
                    </RadioButtonGroup>
                  </div>
                </div>
                <br />
                <br />
                <div id="messageBoxDurationnSlider">
                  Duration 0s
                  <Slider
                    step={1}
                    min={0}
                    max={60}
                    value={0}
                    onChange={this.handleChangeMessageBoxDuration}
                  />
                  <br />
                  <span>Slide the slider to display the message box.</span>
                </div>
              </div>
            </CardText>
            <CardActions>
              <div style={styles.block} id="allertSettings">
                {this.props.getProgressSettings.showProgress === true &&
                  <div>
                    {this.props.getProgressSettings.state === true &&
                      <div id="allertSettingsSuccess">
                        <Favorite
                          style={iconStyles}
                          color={lightGreen400}
                        />{" "}
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
        </div>
      </MuiThemeProvider>
    );
  }
};

const mapStateToProps = state => ({
  getStateAllowSlotValidator: getStateAllowSlotValidator(state),
  getProgressSettings: getProgressSettings(state),
  getMessageBoxSettings: getMessageBoxSettings(state)
});

const mapDispatchToProps = dispatch => {
  return {
    allowSlotValidator: () => {
      dispatch(allowSlotValidator());
    },
    disallowSlotValidator: () => {
      dispatch(disallowSlotValidator());
    },
    toogleMessageBox: messageBoxSettings => {
      dispatch(toogleMessageBox(messageBoxSettings));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
