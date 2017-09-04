import React, { Component } from "react";
import { connect } from "react-redux";
import {
  allowSlotValidator,
  disallowSlotValidator,
  fetchSettingsFromServer,
  progressSettingsSaveSuccess,
  progressSettingsSaveFailed,
  progressSettingsSaveReset
} from "../actions";
import SettingsPage from "../components/SettingsPage";

const SettingsContainer = class SettingsContainer extends Component {
  componentDidMount() {
    fetch("/api/settings", {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.elastic.responses[0].hits !== undefined) {
          let settings = data.elastic.responses[0].hits.hits;
          this.props.fetchSettingsFromServer(settings);
        }
      });
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
    fetchSettingsFromServer: settings => {
      dispatch(fetchSettingsFromServer(settings));
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
