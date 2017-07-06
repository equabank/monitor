import React, { Component } from "react";
import { connect } from "react-redux";
import {
  progressSlotDialogSuccess,
  progressSlotDialogFailed,
  progressSlotDialogWait
} from "../../actions";
import { getProgressSlotDialog } from "../../reducers";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import TimePicker from "material-ui/TimePicker";
import SaveProgress from "./SaveProgress";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { Card, CardHeader, CardText } from "material-ui/Card";
import { colors } from "./libs/Colors";
import { timeRangeSlotValidate } from "./libs/inputValidator";
import Moment from "moment";

const SlotDialog = class SlotDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      uri: "",
      from: Moment().format("HH:mm"),
      to: null,
      type: "range",
      duration: 0,
      color: "default"
    };
  }

  handleClose = () => {
    this.props.closeSlotDialog();
  };

  handleColorRadiobutton(e) {
    this.setSlotState({
      element: "color",
      elementValue: e.target.value
    });
  }

  setSlotState(val = null) {
    if (val != null) this.setState({ [val.element]: val.elementValue });
    this.setState({ title: document.getElementById("title").value });
    this.setState({ uri: document.getElementById("uri").value });
    this.setState({ from: document.getElementById("from").value + ":00" });
    this.setState({ to: document.getElementById("to").value + ":00" });
  }

  saveSlot = e => {
    e.preventDefault();
    this.props.progressSlotDialogWait();

    let slotPayload = {
      title: this.state.title,
      uri: this.state.uri,
      from: this.state.from,
      to: this.state.to,
      type: this.state.type,
      duration: this.state.duration,
      color: this.state.color
    };

    timeRangeSlotValidate(
      this.props.slots,
      slotPayload.from,
      slotPayload.to,
      slotPayload.type
    )
      .then(() => {
        fetch("/api/slots", {
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          method: "POST",
          body: JSON.stringify(slotPayload)
        })
          .then(response => response.json())
          .then(data => {
            if (data.message !== undefined) {
              this.props.progressSlotDialogSuccess(data.message);
            } else if (data.elastic.created === undefined) {
              this.props.progressSlotDialogSuccess("Save slot failed.");
            } else if (data.elastic.created === true) {
              this.props.progressSlotDialogSuccess("Slot succesfull saved.");
            } else {
              this.props.progressSlotDialogFailed("Save slot failed.");
            }
          });
      })
      .catch(err => {
        this.props.progressSlotDialogFailed(err.message);
      });
  };

  render() {
    let actions = [];
    if (this.props.progress.showProgress) {
      actions = [
        <SaveProgress typeProgress={this.props.progress} />,
        <FlatButton
          id="dialogCloseButton"
          label="Close"
          primary={true}
          onTouchTap={this.handleClose}
        />
      ];
    } else {
      actions = [
        <FlatButton
          id="dialogCancelButton"
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          id="dialogSaveButton"
          label="Save slot"
          primary={true}
          keyboardFocused={true}
          onTouchTap={e => this.saveSlot(e)}
        />
      ];
    }

    const styles = {
      toggle: {
        marginBottom: 16
      },
      checkbox: {
        marginBottom: 16
      },
      block: {
        maxWidth: 250
      },
      radioButton: {
        marginBottom: 16
      }
    };

    return (
      <div>
        <Dialog
          title="CREATE SLOT"
          actions={actions}
          modal={false}
          open={this.props.isSlotDialogOpen}
          onRequestClose={this.props.closeSlotDialog}
          autoScrollBodyContent={true}
        >
          <br />
          <Card>
            <CardHeader
              title="Basic info"
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText expandable={false}>
              <TextField
                id="title"
                hintText="Title"
                floatingLabelText="Title"
                onChange={() => this.setSlotState()}
              />
              <br />
              <TextField
                id="uri"
                hintText="URI"
                floatingLabelText="URI"
                defaultValue="http://"
                onChange={() => this.setSlotState()}
              />
              <br />
              <TimePicker
                id="from"
                format="24hr"
                hintText="From"
                autoOk={true}
                defaultTime={new Date()}
                onChange={() => this.setSlotState()}
              />
              <br />
              <TimePicker
                id="to"
                format="24hr"
                hintText="To"
                autoOk={true}
                onChange={() => this.setSlotState()}
              />
            </CardText>
          </Card>
          <br />
          <Card>
            <CardHeader
              title="Color"
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText expandable={false}>
              <RadioButtonGroup
                id="color"
                name="color"
                labelPosition="right"
                style={styles.block}
                defaultSelected="default"
                onChange={e => this.handleColorRadiobutton(e)}
              >
                <RadioButton
                  value="default"
                  label="Default"
                  labelStyle={colors.default}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="green"
                  label="Green"
                  labelStyle={colors.green}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="pink"
                  label="Pink"
                  labelStyle={colors.pink}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="cyan"
                  label="Cyan"
                  labelStyle={colors.cyan}
                  style={styles.radioButton}
                />
                <RadioButton
                  value="orange"
                  label="Orange"
                  labelStyle={colors.orange}
                  style={styles.radioButton}
                />
              </RadioButtonGroup>
            </CardText>
          </Card>
        </Dialog>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  progress: getProgressSlotDialog(state)
});

const mapDispatchToProps = dispatch => {
  return {
    progressSlotDialogSuccess: message => {
      dispatch(progressSlotDialogSuccess(message));
    },
    progressSlotDialogFailed: message => {
      dispatch(progressSlotDialogFailed(message));
    },
    progressSlotDialogWait: () => {
      dispatch(progressSlotDialogWait());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SlotDialog);
