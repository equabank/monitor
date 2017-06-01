import React from "react";
import { shallow, mount } from "enzyme";
import { spy } from "sinon";
import SnackSlotDiscard from "./SnackSlotDiscard";

jest.useFakeTimers();

describe("<SnackSlotDiscard />", () => {
  it("show snack notification", () => {
    const stateDiscard = true;
    const notificationMessage = "Some message";
    const showNotification = true;
    const closeNotificationHandle = spy();
    const wrapper = mount(
      <SnackSlotDiscard
        stateDiscard={stateDiscard}
        notificationMessage={notificationMessage}
        showNotification={showNotification}
        closeNotificationHandle={closeNotificationHandle}
      />
    );
    expect(wrapper.find("#discardNotification").text()).toBe(
      "favorite_borderSome message"
    );
    jest.runTimersToTime(4000);
    expect(closeNotificationHandle.calledOnce).toBeTruthy();
  });
});
