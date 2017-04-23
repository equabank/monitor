import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import {lightGreen500, deepOrangeA400} from 'material-ui/styles/colors';

export default class SnackSlotDiscard extends React.Component {

  render() {

    let _s = this.props.stateDiscard;

    const iconStyles = {
      marginRight: 24,
    };

    const styleSnack = {
      backgroundColor: ( _s === true ? "#F1F8E9" : "#FBE9E7")
    }

    const styleMessage = {
      color: ( _s === true ? "#8BC34A" : "#FF3D00")
    }

    let _message =
      <div id="discardSuccess">
        <FontIcon
          className="material-icons"
          style={iconStyles} color={_s === true ? lightGreen500 : deepOrangeA400}>{_s === true ? "favorite_border" : "pan_tool"}
        </FontIcon>
        <span style={styleMessage}>
          {this.props.notificationMessage}
        </span>
      </div>

    return (
      <div>
        <Snackbar
          open={this.props.showNotification}
          message={_message}
          autoHideDuration={4000}
          onRequestClose={this.props.closeNotificationHandle}
          contentStyle={styleSnack}
          bodyStyle={styleSnack}
        />
      </div>
    );
  }
}