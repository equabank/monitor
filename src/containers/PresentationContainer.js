import React, { Component } from "react";
import Presentation from "../components/Presentation";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default class PresentationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slots: [],
      uri: "",
      usedSlotId: 0,
      showBanner: false,
      bannerUri: null,
      bannerTitle: null
    };
  }

  componentDidMount() {
    this.getSlots();

    let showSlotRangeType = true;
    let backgroundEndTime = null;
    let BreakException = {};
    setInterval(() => {
      this.getSlots();
      let slotAvailable = false;

      if (showSlotRangeType) {
        this.state.slots.forEach(slot => {
          let from = slot._source.from.split(":");
          let _from = moment().hours(from[0]).minutes(from[1]).seconds(from[2]);
          let to = slot._source.to.split(":");
          let _to = moment().hours(to[0]).minutes(to[1]).seconds(to[2]);
          let _now = moment();
          let range = moment.range(_from, _to);

          if (_now.within(range) && slot._id !== this.state.usedSlotId) {
            console.log(
              "Title: " +
                slot._source.title +
                ", Time: " +
                from +
                "/" +
                to +
                " / " +
                _now.within(range)
            );

            this.setState({ uri: slot._source.uri });
            this.setState({ usedSlotId: slot._id });

            if (slot._source.type === "background") {
              backgroundEndTime = _to;
              showSlotRangeType = false;
            }

            this.setState({ bannerTitle: slot._source.title });
            this.setState({ bannerUri: slot._source.uri });
            this.setState({ showBanner: true });
            throw BreakException;
          }
          if (_now.within(range)) {
            slotAvailable = true;
          }
        });

        if (!slotAvailable) {
          this.setState({ uri: "http://localhost:3000/#/pause-page" });
          this.setState({ usedSlotId: 0 });
        }
      } else {
        let _diff = backgroundEndTime.diff(moment(), "seconds");
        if (_diff === 0 || _diff < 0) {
          showSlotRangeType = true;
        }
      }
    }, 1000);

    setInterval(() => {
      this.setState({ showBanner: false });
    }, 3000);
  }

  getSlots() {
    fetch("/api/slots", {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.elastic.responses[0].hits !== undefined) {
          this.setState({ slots: data.elastic.responses[0].hits.hits });
        }
      });
  }

  render() {
    return (
      <div>
        <Presentation
          uri={this.state.uri}
          showBanner={this.state.showBanner}
          bannerUri={this.state.bannerUri}
          bannerTitle={this.state.bannerTitle}
        />
      </div>
    );
  }
}
