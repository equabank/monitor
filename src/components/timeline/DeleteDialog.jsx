import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';

export default class DeleteDialog extends React.Component {

  handleClose = () => {
    this.props.closeDeleteDialog();
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Discard"
        secondary={true}
        onTouchTap={this.props.discardSlot}
        icon={<DeleteForever />}
      />,
    ];

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.props.openDeleteDialog}
          onRequestClose={this.handleClose}
        >
          <h2>Discard this slot?</h2>
        </Dialog>
      </div>
    );
  }
}