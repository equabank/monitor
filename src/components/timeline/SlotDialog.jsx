import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import SaveProgress from './SaveProgress';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {colors} from './libs/Colors';


export default class SlotDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: "",
      uri: "",
      from: "",
      to: "",
      pause: false,
      type: "range",
      duration: 0,
      color: "default",
      progress: {
        show: false,
        type: "none",
        message: ""
      }
    }
  }

  handleClose = () => {
    this.props.closeSlotDialog();
    this.setState({
      progress: {
        show: false,
        type: "none",
        message: ""
      }
    })
  };

  handlePauseCheck(e) {
    this.setSlotState({
      element: "pause",
      elementValue: e.target.value
    })
  }

  handleColorRadiobutton(e) {
    this.setSlotState({
      element: "color",
      elementValue: e.target.value
    })
  }

  setSlotState(val = null) {
    if ( val != null ) this.setState({[val.element]: val.elementValue});
    this.setState({title: document.getElementById('title').value});
    this.setState({uri: document.getElementById('uri').value});
    this.setState({from: document.getElementById('from').value + ":00"});
    this.setState({to: document.getElementById('to').value + ":00"});
  }


  saveSlot(e) {
    this.setState({
      progress: {
        show: true,
        type: "waitForSave"
      }
    });

    let slotPayload = {
      title: this.state.title,
      uri: this.state.uri,
      from: this.state.from,
      to: this.state.to,
      pause: this.state.pause,
      type: this.state.type,
      duration: this.state.duration,
      color: this.state.color
    };

    fetch('/api/slots', {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST',
      body: JSON.stringify(slotPayload)
    })
      .then(response => response.json())
      .then(data => {
        if ( data.message !== undefined) {
          this.setState({
            progress: {
              show: true,
              type: "failed",
              message: `Elasticsearch ${data.message}`
            }
          });
        } else if (data.elastic.created === undefined) {
          this.setState({
            progress: {
              show: true,
              type: "failed",
              message: "Save slot failed"
            }
          });
        } else if (data.elastic.created === true) {
          this.setState({
            progress: {
              show: true,
              type: "success"
            }
          });
        } else {
          this.setState({
            progress: {
              show: true,
              type: "failed",
              message: "Save slot failed"
            }
          });
        }
      });
  }


  render() {

    let actions = [];
    if (this.state.progress.show) {

      actions = [
        <SaveProgress typeProgress={this.state.progress}/>,
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
          onTouchTap={(e) => this.handleClose(e)}
        />,
        <FlatButton
          id="dialogSaveButton"
          label="Save slot"
          primary={true}
          keyboardFocused={true}
          onTouchTap={(e) => this.saveSlot(e)}
        />,
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
        maxWidth: 250,
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
          open={this.props.openSlotDialog}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <br/>
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
              /><br />
              <TextField
                id="uri"
                hintText="URI"
                floatingLabelText="URI"
                defaultValue="http://"
                onChange={() => this.setSlotState()}
              /><br />
              <TimePicker
                id="from"
                format="24hr"
                hintText="From"
                autoOk={true}
                defaultTime={new Date()}
                onChange={() => this.setSlotState()}
              /><br />
              <TimePicker
                id="to"
                format="24hr"
                hintText="To"
                autoOk={true}
                onChange={() => this.setSlotState()}
              />
            </CardText>
          </Card>
          <br/>
          <Card>
            <CardHeader
              title="Pause"
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText expandable={false}>
              <Checkbox
                id="pause"
                label={ this.state.pause ? "Yes" : "No" }
                checkedIcon={<Visibility />}
                uncheckedIcon={<VisibilityOff />}
                style={styles.checkbox}
                onCheck={(e) => this.handlePauseCheck(e)}
                disabled={true}
              />
            </CardText>
          </Card>
          <br/>
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
                onChange={(e) => this.handleColorRadiobutton(e)}
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
}
