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
    let openSlotDialog = spy();
    const button = mount(<CreateSlotButton openSlotDialog={openSlotDialog} />);
    button.find("button#createSlotModalButton").simulate("click");
    expect(openSlotDialog.calledOnce).toBeTruthy();
    done();
  });
});
