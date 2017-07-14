import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSlotsFromServer } from "../actions";
import { getSlots } from "../reducers";
import Timeline from "../components/Timeline";

const TimelineContainer = class TimelineContainer extends Component {
  componentDidMount() {
    fetch("/api/slots", {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.elastic.responses[0].hits !== undefined) {
          let slots = [];
          for (let slot of data.elastic.responses[0].hits.hits) {
            slots.push({
              id: slot._id,
              color: slot._source.color,
              from: slot._source.from,
              title: slot._source.title,
              to: slot._source.to,
              slotType: slot._source.type,
              uri: slot._source.uri
            });
          }
          this.props.fetchSlotsFromServer(slots);
        }
      });
  }

  render() {
    return (
      <div>
        <Timeline slots={this.props.getSlots} />
      </div>
    );
  }
};

const mapStateToProps = state => ({
  getSlots: getSlots(state)
});

const mapDispatchToProps = dispatch => {
  return {
    fetchSlotsFromServer: slots => {
      dispatch(fetchSlotsFromServer(slots));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer);
