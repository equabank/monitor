import React, {PureComponent} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import {lightGreen500, deepOrangeA400} from 'material-ui/styles/colors';

export default class SaveProgress extends PureComponent {

  render() {

    const iconStyles = {
      marginRight: 24,
    };

    return (
      <div id="progressBar">
        { (this.props.typeProgress.type === "waitForSave") &&
          <div id="progressWait">
            <CircularProgress size={30} thickness={2}/> Wait a moment
          </div>
        }

        { (this.props.typeProgress.type === "success") &&
          <div id="progressSuccess">
            <FontIcon className="material-icons" style={iconStyles} color={lightGreen500}>favorite_border</FontIcon>Save successful
          </div>
        }

        { (this.props.typeProgress.type === "failed") &&
        <div id="progressFailed">
          <FontIcon className="material-icons" style={iconStyles} color={deepOrangeA400}>pan_tool</FontIcon>Save failed: {this.props.typeProgress.message}
        </div>
        }
      </div>
    );
  }
}
