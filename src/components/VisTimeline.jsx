import React, { Component } from "react";
import { connect } from "react-redux";
import { selectSlotById } from "../actions";
import ReactDOM from "react-dom";
import vis from "../../node_modules/vis/dist/vis-timeline-graph2d.min.js";
import moment from "moment";

const VisTimeline = class VisTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slots: [],
      existTimeline: false
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ slots: props.slots });
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.data !== this.props.data) {
      console.log("Data changed");
    }
    if (!this.state.existTimeline) {
      this.setState({ existTimeline: true });
      this.drawTimeline();
    }
  };

  drawTimeline = () => {
    const container = ReactDOM.findDOMNode(this.refs.timelineBox);

    let slotsContainer = [];
    for (var _slot of this.state.slots) {
      let from = _slot.from.split(":");
      let to = _slot.to.split(":");
      let _start = moment()
        .hours(from[0])
        .minutes(from[1])
        .seconds(from[2])
        .format("YYYY-MM-DD HH:mm:ss");
      let _end = moment()
        .hours(to[0])
        .minutes(to[1])
        .seconds(to[2])
        .format("YYYY-MM-DD HH:mm:ss");
      let slot = {
        id: _slot.id,
        start: _start,
        end: _end,
        content: _slot.title,
        type: _slot.slotType,
        title:
          "<b>" +
          _slot.title +
          "</b><br />" +
          moment(_start).format("HH:mm:ss") +
          " - " +
          moment(_end).format("HH:mm:ss") +
          "<br/>" +
          _slot.uri,
        body: {
          range:
            moment(_start).format("HH:mm:ss") +
            " - " +
            moment(_end).format("HH:mm:ss"),
          uri: _slot.uri
        },
        className: "slot-material-" + _slot.color
      };
      slotsContainer.push(slot);
    }

    // Configuration for the Timeline
    let options = {
      width: "100%",
      margin: {
        item: 40 // v pripade background eventu
      },
      autoResize: true,
      clickToUse: false,
      max: moment()
        .add(1, "days")
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format("YYYY-MM-DD HH:mm:ss"),
      end: moment()
        .add(1, "days")
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format("YYYY-MM-DD HH:mm:ss"),
      start: moment()
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format("YYYY-MM-DD HH:mm:ss"),
      min: moment()
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format("YYYY-MM-DD HH:mm:ss"),
      stack: false,
      showCurrentTime: true,
      template: function(item, element, data) {
        return (
          "" +
          '<span id="slot-' +
          item.id +
          '" class="slotTitle">' +
          item.content +
          "</span><br/>" +
          '<span id="slot-' +
          item.id +
          '" class="slotRange">' +
          item.body.range +
          "</span><br/>" +
          '<span id="slot-' +
          item.id +
          '" class="slotUri" href="' +
          item.body.uri +
          '" target="_blank">' +
          item.body.uri +
          "</span>"
        );
      }
    };

    let items = new vis.DataSet(slotsContainer);

    let timeline = new vis.Timeline(container, items, options);
    timeline.on("click", prop => {
      for (var _slot of slotsContainer) {
        if (_slot.id === prop.item) {
          this.props.selectSlotById(this.props.slots, _slot.id);
        }
      }
    });
  };

  render() {
    return <div id="timelineBox" ref="timelineBox" />;
  }
};

const mapDispatchToProps = dispatch => {
  return {
    selectSlotById: (slots, slotId) => {
      dispatch(selectSlotById(slots, slotId));
    }
  };
};

export default connect(null, mapDispatchToProps)(VisTimeline);
