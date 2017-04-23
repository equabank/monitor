import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';

export default class DeleteSlotButton extends Component {

  render() {

    const styles = {
      button: {
        margin: 12
      }
    };

    return (
      <RaisedButton
        label="DISCARD"
        secondary={true}
        style={styles.button}
        icon={<DeleteForever />}
        disabled={this.props.selectedSlotId == null ? true : false}
        onTouchTap={this.props.openDeleteDialog}
      />
    );
  }
}
