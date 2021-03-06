import React, { Component } from "react";
import { connect } from "react-redux";
import {
  allowSlotValidator,
  disallowSlotValidator,
  toogleMessageBox,
  saveSettings,
  saveToLocalstorage,
  deleteFromLocalstorage
} from "../actions";
import {
  getStateAllowSlotValidator,
  getProgressSettings,
  getMessageBoxSettings,
  getMessageBoxChips
} from "../reducers";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toggle from "material-ui/Toggle";
import TextField from "material-ui/TextField";
import Slider from "material-ui/Slider";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import AlertError from "material-ui/svg-icons/alert/error";
import NonSelectColorMessage from "material-ui/svg-icons/action/done";
import SelectColorMessage from "material-ui/svg-icons/action/check-circle";
import Schedule from "material-ui/svg-icons/action/schedule";
import Snooze from "material-ui/svg-icons/av/snooze";
import { red400 } from "material-ui/styles/colors";
import FlatButton from "material-ui/FlatButton";
import Chip from "material-ui/Chip";
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
  },
  chipWrapper: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 4
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
      this.props.saveSettings();
    } else {
      this.props.allowSlotValidator();
      this.props.saveSettings();
    }
  };

  handleChangeMessageBoxMessage = event => {
    this.props.toogleMessageBox({
      message: event.target.value,
      color: this.props.getMessageBoxSettings.color,
      endTime: this.props.getMessageBoxSettings.endTime
    });
  };

  handleChangeMessageBoxDuration = (event, value) => {
    this.props.toogleMessageBox({
      message: this.props.getMessageBoxSettings.message,
      color: this.props.getMessageBoxSettings.color,
      endTime: Moment().add(value, "seconds")
    });
  };

  handleChangeMessageBoxMaxDuration = duration => {
    this.props.toogleMessageBox({
      message: this.props.getMessageBoxSettings.message,
      color: this.props.getMessageBoxSettings.color,
      endTime: Moment().add(duration, "seconds")
    });
    this.props.saveSettings();
    this.props.saveToLocalstorage();
  };

  handleChangeMessageBoxColor = (event, value) => {
    this.props.toogleMessageBox({
      message: this.props.getMessageBoxSettings.message,
      color: value,
      endTime: this.props.getMessageBoxSettings.endTime
    });
  };

  handleDeleteChip = message => {
    this.props.deleteFromLocalstorage(message);
  };

  handleChangeMessageFromChip = message => {
    this.props.toogleMessageBox({
      message: message,
      color: this.props.getMessageBoxSettings.color,
      endTime: this.props.getMessageBoxSettings.endTime
    });
  };

  componentDidMount() {
    setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  render() {
    let endTimeNow = Moment();
    let endTimeSet = Moment(this.props.getMessageBoxSettings.endTime);
    let durationDiff = endTimeSet.diff(endTimeNow, "seconds");
    if (durationDiff < 0) {
      durationDiff = 0;
    }
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
          </Card>

          <Card>
            <CardTitle title="Message Banner" subtitle="" />
            <CardText>
              <div id="messageBannerBox">
                <div id="messageBoxTextarea">
                  <div id="messageBoxTextareaChips" style={styles.chipWrapper}>
                    {this.props.getMessageBoxChips.map((chip, index) =>
                      <div id={index} key={index}>
                        <Chip
                          key={index}
                          onRequestDelete={() => this.handleDeleteChip(chip)}
                          onClick={() => this.handleChangeMessageFromChip(chip)}
                          style={styles.chip}
                        >
                          {chip}
                        </Chip>
                      </div>
                    )}
                  </div>
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
                      defaultSelected="notice"
                      onChange={this.handleChangeMessageBoxColor}
                      valueSelected={this.props.getMessageBoxSettings.color}
                    >
                      <RadioButton
                        value="Notice"
                        label="Notice message"
                        checkedIcon={<SelectColorMessage />}
                        uncheckedIcon={<NonSelectColorMessage />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#29B6F6" }}
                      />
                      <RadioButton
                        value="Warning"
                        label="Warning message"
                        checkedIcon={<SelectColorMessage />}
                        uncheckedIcon={<NonSelectColorMessage />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#EF5350" }}
                      />
                      <RadioButton
                        value="Success"
                        label="Success message"
                        checkedIcon={<SelectColorMessage />}
                        uncheckedIcon={<NonSelectColorMessage />}
                        style={styles.radioButton}
                        labelStyle={{ color: "#9CCC65" }}
                      />
                    </RadioButtonGroup>
                  </div>
                </div>
                <br />
                <br />
                <div id="messageBoxDurationnSlider">
                  Duration {durationDiff}s {" "}
                  {durationDiff > 0 &&
                    <span id="endTime">
                      ({Moment(this.props.getMessageBoxSettings.endTime).format(
                        "HH:mm:ss"
                      )})
                    </span>}
                  <Slider
                    step={1}
                    min={0}
                    max={120}
                    value={durationDiff}
                    onChange={this.handleChangeMessageBoxDuration}
                    onDragStop={this.props.saveSettings}
                  />
                  <FlatButton
                    label="10s"
                    primary={true}
                    onClick={() => this.handleChangeMessageBoxMaxDuration(10)}
                    icon={<Schedule />}
                  />
                  <FlatButton
                    label="60s"
                    primary={true}
                    onClick={() => this.handleChangeMessageBoxMaxDuration(60)}
                    icon={<Schedule />}
                  />
                  <FlatButton
                    label="120s"
                    primary={true}
                    onClick={() => this.handleChangeMessageBoxMaxDuration(120)}
                    icon={<Schedule />}
                  />
                  {durationDiff > 0 &&
                    <FlatButton
                      label="Snooze"
                      secondary={true}
                      onClick={() => this.handleChangeMessageBoxMaxDuration(0)}
                      icon={<Snooze />}
                    />}
                </div>
              </div>
            </CardText>
            <CardActions>
              <div style={styles.block} id="allertSettings">
                {this.props.getProgressSettings.showProgress === true &&
                  <div>
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
  getMessageBoxSettings: getMessageBoxSettings(state),
  getMessageBoxChips: getMessageBoxChips(state)
});

const mapDispatchToProps = dispatch => {
  return {
    allowSlotValidator: () => {
      dispatch(allowSlotValidator());
    },
    disallowSlotValidator: () => {
      dispatch(disallowSlotValidator());
    },
    toogleMessageBox: message => {
      dispatch(toogleMessageBox(message));
    },
    saveSettings: () => {
      dispatch(saveSettings());
    },
    saveToLocalstorage: () => {
      dispatch(saveToLocalstorage());
    },
    deleteFromLocalstorage: message => {
      dispatch(deleteFromLocalstorage(message));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
