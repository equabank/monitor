import React from "react";
import Snackbar from "material-ui/Snackbar";
import FontIcon from "material-ui/FontIcon";
import { lightGreen500, deepOrangeA400 } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export default class SnackSlotDiscard extends React.Component {
  render() {
    let _s = this.props.discardSlotProgress.discardState;

    const iconStyles = {
      marginRight: 24
    };

    const styleSnack = {
      backgroundColor: _s === true ? "#F1F8E9" : "#FBE9E7"
    };

    const styleMessage = {
      color: _s === true ? "#8BC34A" : "#FF3D00"
    };

    let _message = (
      <div id="discardNotification">
        <FontIcon
          className="material-icons"
          style={iconStyles}
          color={_s === true ? lightGreen500 : deepOrangeA400}
        >
          {_s === true ? "favorite_border" : "pan_tool"}
        </FontIcon>
        <span style={styleMessage}>
          {this.props.discardSlotProgress.message}
        </span>
      </div>
    );

    return (
      <div>
        <MuiThemeProvider>
          <Snackbar
            id="snackNotification"
            open={this.props.discardSlotProgress.showProgress}
            message={_message}
            autoHideDuration={4000}
            onRequestClose={this.props.discardSlotProgressReset}
            contentStyle={styleSnack}
            bodyStyle={styleSnack}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
