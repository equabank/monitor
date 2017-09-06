import React, { Component } from "react";
import { connect } from "react-redux";
import {
  allowSlotValidator,
  disallowSlotValidator,
  loadSettingsFromServer,
  progressSettingsSaveSuccess,
  progressSettingsSaveFailed,
  progressSettingsSaveReset
} from "../actions";
import SettingsPage from "../components/SettingsPage";

const SettingsContainer = class SettingsContainer extends Component {
  componentDidMount() {
    this.props.loadSettingsFromServer();
  }

  render() {
    return (
      <div id="settingsContainer">
        <SettingsPage
          allowSlotValidator={this.props.getStateAllowSlotValidator}
        />
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    loadSettingsFromServer: settings => {
      dispatch(loadSettingsFromServer(settings));
    },
    allowSlotValidator: () => {
      dispatch(allowSlotValidator());
    },
    disallowSlotValidator: () => {
      dispatch(disallowSlotValidator());
    },
    progressSettingsSaveSuccess: message => {
      dispatch(progressSettingsSaveSuccess(message));
    },
    progressSettingsSaveFailed: message => {
      dispatch(progressSettingsSaveFailed(message));
    },
    progressSettingsSaveReset: () => {
      dispatch(progressSettingsSaveReset());
    }
  };
};

export default connect(null, mapDispatchToProps)(SettingsContainer);
