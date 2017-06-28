import React, { Component } from "react";
import { connect } from "react-redux";
import { openSlotDialog, closeSlotDialog } from "../actions";
import { getStateSlotDialog } from "../reducers";
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
    this.toggleOpenModal = this.toggleOpenModal.bind(this);
    this.closeDialogs = this.closeDialogs.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.discardSlot = this.discardSlot.bind(this);
    this.closeNotificationHandle = this.closeNotificationHandle.bind(this);

    this.state = {
      selectedSlotId: null,
      openDeleteDialog: false,
      showNotification: false,
      notificationMessage: "",
      stateDiscard: true,
      slotUri: "",
      slots: []
    };
  }

  closeNotificationHandle = () => {
    this.setState({ showNotification: false });
  };

  toggleOpenModal = () => {
    this.setState({ selectedSlotId: null });
    this.setState({ openSlotDialog: true });
  };

  openDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  };

  closeDialogs = () => {
    this.setState({ openSlotDialog: false });
    this.setState({ openDeleteDialog: false });
    this.setState({ selectedSlotId: null });
  };

  discardSlot = () => {
    this.closeDialogs();
    fetch(`/api/slots/${this.state.selectedSlotId}`, {
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
          this.setState({ notificationMessage: "Discard slot succesfull" });
          this.setState({ stateDiscard: true });
          this.setState({ showNotification: true });
        } else {
          this.setState({ notificationMessage: "Discard not succesfull" });
          this.setState({ stateDiscard: false });
          this.setState({ showNotification: true });
        }
      });
  };

  componentWillReceiveProps(props) {
    let _slots = props.slots;
    if (_slots.length > 0) {
      this.setState({ slots: _slots });
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Card>
          <CardHeader title="Timeline" />
          <CardActions>
            <CreateSlotButton openSlotDialog={this.props.openSlotDialog} />
            <DeleteSlotButton
              selectedSlotId={this.state.selectedSlotId}
              openDeleteDialog={this.openDeleteDialog}
            />
            {this.state.selectedSlotId !== null &&
              <ShowUri slotUri={this.state.slotUri} />}
            <SlotDialog
              isSlotDialogOpen={this.props.isSlotDialogOpen}
              closeSlotDialog={this.props.closeSlotDialog}
              slots={this.props.slots}
            />
            <DeleteDialog
              openDeleteDialog={this.state.openDeleteDialog}
              closeDeleteDialog={this.closeDialogs}
              discardSlot={this.discardSlot}
            />
            <SnackSlotDiscard
              stateDiscard={this.state.stateDiscard}
              notificationMessage={this.state.notificationMessage}
              showNotification={this.state.showNotification}
              closeNotificationHandle={this.closeNotificationHandle}
            />
          </CardActions>
          <CardText expandable={false}>
            <VisTimeline slots={this.state.slots} />
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
};

const mapStateToProps = state => ({
  isSlotDialogOpen: getStateSlotDialog(state)
});

const mapDispatchToProps = dispatch => {
  return {
    openSlotDialog: () => {
      dispatch(openSlotDialog());
    },
    closeSlotDialog: () => {
      dispatch(closeSlotDialog());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
