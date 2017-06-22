import React from "react";
import { shallow, mount } from "enzyme";
import { spy } from "sinon";
import Timeline from "./Timeline";

const slots = [
  {
    _index: "monitor-slots",
    _type: "monitor-slots",
    _id: "1493035262530",
    _score: 1,
    _source: {
      timestamp: "2017-04-24T12:01:02.530Z",
      from: "06:00:00",
      to: "06:10:00",
      color: "default",
      title: "Application 1",
      type: "range",
      uri: "http://",
      duration: 0,
      pause: false
    }
  },
  {
    _index: "monitor-slots",
    _type: "monitor-slots",
    _id: "1493035263218",
    _score: 1,
    _source: {
      timestamp: "2017-04-24T12:01:03.218Z",
      from: "06:10:00",
      to: "06:20:00",
      color: "default",
      title: "Application 2",
      type: "range",
      uri: "http://",
      duration: 0,
      pause: false
    }
  },
  {
    _index: "monitor-slots",
    _type: "monitor-slots",
    _id: "1493035263270",
    _score: 1,
    _source: {
      timestamp: "2017-04-24T12:01:03.270Z",
      from: "06:30:00",
      to: "06:40:00",
      color: "default",
      title: "Application 4",
      type: "range",
      uri: "http://",
      duration: 0,
      pause: false
    }
  }
];

describe("<Timeline />", () => {
  it("exist", done => {
    const wrapper = mount(<Timeline slots={slots} />);
    expect(wrapper.find("#timelineBox")).toBeTruthy();
    done();
  });
});
