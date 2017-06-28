import React, { Component } from "react";
import ReactDOM from "react-dom";
import vis from "../../node_modules/vis/dist/vis-timeline-graph2d.min.js";
import moment from "moment";

export default class VisTimeline extends Component {
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

  /*
  shouldComponentUpdate(nextProps, nextState) {
    console.log("should update");
    return this.props === nextProps
      ? true
      : false || this.state === nextState ? true : false;
  }
  */

  drawTimeline = () => {
    const container = ReactDOM.findDOMNode(this.refs.timelineBox);

    let slotsContainer = [];
    for (var _slot of this.state.slots) {
      if (_slot._source !== undefined) {
        let from = _slot._source.from.split(":");
        let to = _slot._source.to.split(":");
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
          id: _slot._id,
          start: _start,
          end: _end,
          content: _slot._source.title,
          type: _slot._source.type,
          title: "<b>" +
            _slot._source.title +
            "</b><br />" +
            moment(_start).format("HH:mm:ss") +
            " - " +
            moment(_end).format("HH:mm:ss") +
            "<br/>" +
            _slot._source.uri,
          body: {
            range: moment(_start).format("HH:mm:ss") +
              " - " +
              moment(_end).format("HH:mm:ss"),
            uri: _slot._source.uri
          },
          className: "slot-material-" + _slot._source.color
        };
        slotsContainer.push(slot);
      }
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
          this.setState({ slotUri: _slot.body.uri });
        }
      }
      this.setState({ selectedSlotId: prop.item });
    });
  };

  render() {
    return <div id="timelineBox" ref="timelineBox" />;
  }
}
