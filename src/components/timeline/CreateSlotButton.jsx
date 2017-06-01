import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export default class CreateSlotButton extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <RaisedButton
          id="createSlotModalButton"
          label="Create Slot"
          primary={true}
          onClick={() => this.props.toggleOpenModal()}
        />
      </MuiThemeProvider>
    );
  }
}
