import React, { Component } from "react";
import { connect } from "react-redux";
import {
  openSlotDialog,
  closeSlotDialog,
  showDeleteDialog,
  hideDeleteDialog,
  discardSlotProgressReset,
  discardSlotProgressFailed,
  discardSlotProgressSuccess,
  discardSlotProgressWait
} from "../actions";
import {
  getStateSlotDialog,
  getSelectedSlot,
  getStateDeleteSlotDialog,
  getProgressDiscardSlot
} from "../reducers";
import { Card, CardHeader, CardActions, CardText } from "material-ui/Card";
import SlotDialog from "./timeline/SlotDialog";
import DeleteDialog from "./timeline/DeleteDialog";
import CreateSlotButton from "./timeline/CreateSlotButton";
import DeleteSlotButton from "./timeline/DeleteSlotButton";
import SnackSlotDiscard from "./timeline/SnackSlotDiscard";
import ShowUri from "./timeline/ShowUri";
import VisTimeline from "./VisTimeline";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const Timeline = class Timeline extends Component {
  constructor(props) {
    super(props);
    this.discardSlot = this.discardSlot.bind(this);
  }

  discardSlot = () => {
    this.props.hideDeleteDialog();
    this.props.discardSlotProgressWait();

    fetch(`/api/slots/${this.props.selectedSlot.id}`, {
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      method: "DELETE"
    })
      .then(response => response.json())
      .then(response => {
        if (
          response.elastic.found === true &&
          response.elastic.result === "deleted"
        ) {
          this.props.discardSlotProgressSuccess("Discard slot succesfull");
        } else {
          this.props.discardSlotProgressFailed("Discard not succesfull");
        }
      });
  };

  render() {
    return (
      <MuiThemeProvider>
        <Card>
          <CardHeader title="Timeline" />
          <CardActions>
            <CreateSlotButton openSlotDialog={this.props.openSlotDialog} />
            <DeleteSlotButton
              selectedSlot={this.props.selectedSlot}
              openDeleteDialog={this.props.showDeleteDialog}
            />
            {this.props.selectedSlot.uri !== undefined &&
              <ShowUri slotUri={this.props.selectedSlot.uri} />}
            <SlotDialog
              isSlotDialogOpen={this.props.isSlotDialogOpen}
              closeSlotDialog={this.props.closeSlotDialog}
              slots={this.props.slots}
            />
            <DeleteDialog
              isDeleteSlotDialogOpen={this.props.isDeleteSlotDialogOpen}
              hideDeleteDialog={this.props.hideDeleteDialog}
              discardSelectedSlot={this.discardSlot}
            />
            <SnackSlotDiscard
              discardSlotProgress={this.props.discardSlotProgress}
              discardSlotProgressReset={this.props.discardSlotProgressReset}
            />
          </CardActions>
          <CardText expandable={false}>
            <VisTimeline slots={this.props.slots} />
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
};

const mapStateToProps = state => ({
  isSlotDialogOpen: getStateSlotDialog(state),
  selectedSlot: getSelectedSlot(state),
  isDeleteSlotDialogOpen: getStateDeleteSlotDialog(state),
  discardSlotProgress: getProgressDiscardSlot(state)
});

const mapDispatchToProps = dispatch => {
  return {
    openSlotDialog: () => {
      dispatch(openSlotDialog());
    },
    closeSlotDialog: () => {
      dispatch(closeSlotDialog());
    },
    showDeleteDialog: () => {
      dispatch(showDeleteDialog());
    },
    hideDeleteDialog: () => {
      dispatch(hideDeleteDialog());
    },
    discardSlotProgressSuccess: message => {
      dispatch(discardSlotProgressSuccess(message));
    },
    discardSlotProgressFailed: message => {
      dispatch(discardSlotProgressFailed(message));
    },
    discardSlotProgressWait: () => {
      dispatch(discardSlotProgressWait());
    },
    discardSlotProgressReset: () => {
      dispatch(discardSlotProgressReset());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
