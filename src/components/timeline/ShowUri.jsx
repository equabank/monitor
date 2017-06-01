import React from "react";
import TextField from "material-ui/TextField";

export default class SnackSlotDiscard extends React.Component {
  render() {
    return <TextField id="slotUri" value={this.props.slotUri} />;
  }
}
