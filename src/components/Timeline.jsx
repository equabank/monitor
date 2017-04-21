import React, {Component} from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import vis from '../../node_modules/vis/dist/vis-timeline-graph2d.min.js';
import moment from 'moment';
import SlotDialog from './timeline/SlotDialog';

export default class Timeline extends Component {

  componentWillReceiveProps( props ) {
    let _slots = props.slots;
    if ( _slots.length > 0 ) {
      this.updateTimeline(_slots);
    }
  }

  updateTimeline( _slots ) {
    let slotsContainer = [], _i = 0;
    for (var _slot of _slots) {
      if ( _slot._source !== undefined ) {
        _i++;
        let from = _slot._source.from.split(":");
        let to = _slot._source.to.split(":");
        let slot = {
          id: _i,
          start: moment().hours(from[0]).minutes(from[1]).seconds(from[2]).format("YYYY-MM-DD HH:mm:ss"),
          end: moment().hours(to[0]).minutes(to[1]).seconds(to[2]).format("YYYY-MM-DD HH:mm:ss"),
          content: _slot._source.title,
          type: _slot._source.type,
          title: _slot._source.uri
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
        item: 240 // v pripade background eventu
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
        return '<h1>' + item.content + '</h1><p>' + item.title + '</p>';
      }
    };

    new vis.Timeline(container, items, options);
  }

  render() {
    return (
      <Card>
        <CardHeader
          title="Timeline"
        />
        <CardActions>
          <SlotDialog />
        </CardActions>
        <CardText expandable={false}>
          <div id="timelineBox"></div>
        </CardText>
      </Card>
    );
  }
}