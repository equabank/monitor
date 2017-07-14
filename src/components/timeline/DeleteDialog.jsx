import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import DeleteForever from "material-ui/svg-icons/action/delete-forever";

export default class DeleteDialog extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => this.props.hideDeleteDialog()}
      />,
      <FlatButton
        label="Discard"
        secondary={true}
        onClick={() => this.props.discardSelectedSlot()}
        icon={<DeleteForever />}
      />
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.props.isDeleteSlotDialogOpen}
          onRequestClose={() => this.props.hideDeleteDialog()}
        >
          <h2>Discard this slot?</h2>
        </Dialog>
      </div>
    );
  }
}
