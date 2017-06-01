import React from "react";
import { shallow } from "enzyme";
import ShowUri from "./ShowUri";

describe("<ShowUri />", () => {
  it("show Uri in input", () => {
    const slotUri = "http://monitor.io";
    const wrapper = shallow(<ShowUri slotUri={slotUri} />);
    expect(wrapper.prop("value")).toBe(slotUri);
  });
});
