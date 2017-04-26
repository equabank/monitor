import React, {Component} from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import vis from '../../node_modules/vis/dist/vis-timeline-graph2d.min.js';
import moment from 'moment';
import SlotDialog from './timeline/SlotDialog';
import DeleteDialog from './timeline/DeleteDialog';
import CreateSlotButton from './timeline/CreateSlotButton';
import DeleteSlotButton from './timeline/DeleteSlotButton';
import SnackSlotDiscard from './timeline/SnackSlotDiscard';
import ShowUri from './timeline/ShowUri';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Timeline extends Component {

  constructor(props) {
    super(props);
    this.toggleOpenModal = this.toggleOpenModal.bind(this);
    this.closeDialogs = this.closeDialogs.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.discardSlot = this.discardSlot.bind(this);
    this.closeNotificationHandle = this.closeNotificationHandle.bind(this);

    this.state = {
      selectedSlotId: null,
      openSlotDialog: false,
      openDeleteDialog: false,
      showNotification: false,
      notificationMessage: "",
      stateDiscard: true,
      slotUri: ""
    }

  }

  closeNotificationHandle = () => {
    this.setState({ showNotification: false });
  }

  toggleOpenModal = () => {
    this.setState({ selectedSlotId: null });
    this.setState({ openSlotDialog: true });
  };

  openDeleteDialog = () => {
    this.setState({ openDeleteDialog: true });
  }

  closeDialogs = () => {
    this.setState({ openSlotDialog: false });
    this.setState({ openDeleteDialog: false });
    this.setState({ selectedSlotId: null });
  };

  discardSlot = () => {
    this.closeDialogs();
    fetch(`/api/slots/${this.state.selectedSlotId}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(response => {
        if ( response.elastic.found === true && response.elastic.result === "deleted" ) {
          this.setState({ notificationMessage: "Discard slot succesfull"});
          this.setState({ stateDiscard: true });
          this.setState({ showNotification: true });
        } else {
          this.setState({ notificationMessage: "Discard not succesfull"});
          this.setState({ stateDiscard: false });
          this.setState({ showNotification: true });
        }
      });
  }

  componentWillReceiveProps( props ) {
    let _slots = props.slots;
    if ( _slots.length > 0 ) {
      this.updateTimeline(_slots);
    }
  }

  updateTimeline( _slots ) {
    let slotsContainer = [];
    for (var _slot of _slots) {
      if ( _slot._source !== undefined ) {
        let from = _slot._source.from.split(":");
        let to = _slot._source.to.split(":");
        let _start = moment().hours(from[0]).minutes(from[1]).seconds(from[2]).format("YYYY-MM-DD HH:mm:ss");
        let _end = moment().hours(to[0]).minutes(to[1]).seconds(to[2]).format("YYYY-MM-DD HH:mm:ss");
        let slot = {
          id: _slot._id,
          start: _start,
          end: _end,
          content: _slot._source.title,
          type: _slot._source.type,
          title: "<b>" + _slot._source.title + "</b><br />" + moment(_start).format("HH:mm:ss") + " - " + moment(_end).format("HH:mm:ss") + "<br/>" +_slot._source.uri,
          body: {
            range:moment(_start).format("HH:mm:ss") + " - " + moment(_end).format("HH:mm:ss"),
            uri: _slot._source.uri
          },
          className: "slot-material-" + _slot._source.color
        }
        slotsContainer.push(slot);
      }
    }
    const container = document.getElementById('timelineBox');

    let items = new vis.DataSet(slotsContainer);

    // Configuration for the Timeline
    let options = {
      width: '100%',
      margin: {
        item: 40 // v pripade background eventu
      },
      autoResize: true,
      clickToUse: false,
      max: moment().add(1, 'days').hours(0).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss"),
      end: moment().add(1, 'days').hours(0).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss"),
      start: moment().hours(0).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss"),
      min: moment().hours(0).minutes(0).seconds(0).format("YYYY-MM-DD HH:mm:ss"),
      stack: false,
      showCurrentTime: true,
      template: function (item, element, data) {
        return '' +
          '<span id="slot-'+item.id+'" class="slotTitle">' + item.content + '</span><br/>' +
          '<span id="slot-'+item.id+'" class="slotRange">' + item.body.range + '</span><br/>' +
          '<span id="slot-'+item.id+'" class="slotUri" href="'+item.body.uri+'" target="_blank">' + item.body.uri + '</span>';
      }
    };

    let timeline = new vis.Timeline(container, items, options);

    timeline.on('click', (prop) => {
      for (var _slot of slotsContainer) {
        if ( _slot.id === prop.item ) {
          this.setState({ slotUri: _slot.body.uri});
        }
      }
      this.setState({ selectedSlotId: prop.item});
    });

  }

  render() {
    return (
      <MuiThemeProvider>
        <Card>
          <CardHeader
            title="Timeline"
          />
          <CardActions>
            <CreateSlotButton toggleOpenModal={ this.toggleOpenModal } />
            <DeleteSlotButton selectedSlotId={ this.state.selectedSlotId } openDeleteDialog={ this.openDeleteDialog } />
            { this.state.selectedSlotId !== null &&
              <ShowUri slotUri={ this.state.slotUri }/>
            }
            <SlotDialog openSlotDialog={ this.state.openSlotDialog } closeSlotDialog={ this.closeDialogs } />
            <DeleteDialog openDeleteDialog={ this.state.openDeleteDialog } closeDeleteDialog={ this.closeDialogs } discardSlot={ this.discardSlot } />
            <SnackSlotDiscard stateDiscard={ this.state.stateDiscard } notificationMessage={ this.state.notificationMessage } showNotification={ this.state.showNotification } closeNotificationHandle={ this.closeNotificationHandle } />
          </CardActions>
          <CardText expandable={false}>
            <div id="timelineBox"></div>
          </CardText>
        </Card>
      </MuiThemeProvider>
    );
  }
}