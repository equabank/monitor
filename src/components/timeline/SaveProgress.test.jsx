import React from "react";
import { shallow } from "enzyme";
import SaveProgress from "./SaveProgress";

describe("<SaveProgress />", () => {
  it("show wait progress", done => {
    const typeProgress = {
      type: "waitForSave"
    };
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    const progressType = "Wait a moment";
    expect(wrapper.find("progressWait")).toBeTruthy();
    done();
  });

  it("show successful progress", done => {
    const typeProgress = {
      type: "success"
    };
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    expect(wrapper.find("progressSuccess")).toBeTruthy();
    done();
  });

  it("show failed progress", done => {
    const typeProgress = {
      type: "failed"
    };
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    expect(wrapper.find("progressFailed")).toBeTruthy();
    done();
  });
});
