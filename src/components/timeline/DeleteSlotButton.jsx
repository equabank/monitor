import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import DeleteForever from "material-ui/svg-icons/action/delete-forever";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export default class DeleteSlotButton extends Component {
  render() {
    const styles = {
      button: {
        margin: 12
      }
    };

    return (
      <MuiThemeProvider>
        <RaisedButton
          id="deleteSlotButton"
          label="DISCARD"
          secondary={true}
          style={styles.button}
          icon={<DeleteForever />}
          disabled={this.props.selectedSlotId == null ? true : false}
          onClick={() => this.props.openDeleteDialog()}
        />
      </MuiThemeProvider>
    );
  }
}
