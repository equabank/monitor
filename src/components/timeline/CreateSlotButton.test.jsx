import React from "react";
import { mount } from "enzyme";
import { spy } from "sinon";
import CreateSlotButton from "./CreateSlotButton";
import injectTapEventPlugin from "react-tap-event-plugin";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

describe("<CreateSlotButton />", () => {
  it("toogleModal", done => {
    let toggleOpenModal = spy();
    const button = mount(
      <CreateSlotButton toggleOpenModal={toggleOpenModal} />
    );
    button.find("button#createSlotModalButton").simulate("click");
    expect(toggleOpenModal.calledOnce).toBeTruthy();
    done();
  });
});
