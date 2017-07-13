import React from "react";
import { shallow, mount } from "enzyme";
import { spy } from "sinon";
import SnackSlotDiscard from "./SnackSlotDiscard";

jest.useFakeTimers();

describe("<SnackSlotDiscard />", () => {
  it("show snack notification", done => {
    const discardSlotProgress = {
      discardState: true,
      message: "Some message",
      showProgress: true
    };
    const discardSlotProgressReset = spy();
    const wrapper = mount(
      <SnackSlotDiscard
        discardSlotProgress={discardSlotProgress}
        discardSlotProgressReset={discardSlotProgressReset}
      />
    );
    expect(wrapper.find("#discardNotification").text()).toBe(
      "favorite_borderSome message"
    );
    jest.runTimersToTime(4000);
    expect(discardSlotProgressReset.calledOnce).toBeTruthy();
    done();
  });
});
