import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class CreateSlotButton extends Component {
  render() {
    const {toggleOpenModal} = this.props;
    return (
      <RaisedButton label="Create Slot" primary={true} onTouchTap={toggleOpenModal} />
    );
  }
}
