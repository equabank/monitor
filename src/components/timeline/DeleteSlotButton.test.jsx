import React from "react";
import { mount } from "enzyme";
import { spy } from "sinon";
import DeleteSlotButton from "./DeleteSlotButton";
import injectTapEventPlugin from "react-tap-event-plugin";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

describe("<DeleteSlotButton />", () => {
  it("disabled openDeleteDialog button when not selected any slot", done => {
    const selectedSlotId = null;
    const openDeleteDialog = {};
    const button = mount(
      <DeleteSlotButton
        selectedSlotId={selectedSlotId}
        openDeleteDialog={openDeleteDialog}
      />
    );
    let disabledButton = button
      .find("button#deleteSlotButton")
      .prop("disabled");
    expect(disabledButton).toBeTruthy();
    done();
  });

  it("openDeleteDialog when select any slot", done => {
    const selectedSlotId = 123;
    let openDeleteDialog = spy();
    const button = mount(
      <DeleteSlotButton
        selectedSlotId={selectedSlotId}
        openDeleteDialog={openDeleteDialog}
      />
    );
    button.find("button#deleteSlotButton").simulate("click");
    expect(openDeleteDialog.calledOnce).toBeTruthy();
    done();
  });
});
