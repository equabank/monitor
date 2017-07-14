import * as actions from "./index";
import * as types from "../constants/ActionTypes";

describe("actions", () => {
  describe("slots", () => {
    it("openSlotDialog", () => {
      const expectedAction = {
        type: types.TOGGLE_SLOT_DIALOG,
        showDialog: true
      };
      expect(actions.openSlotDialog()).toEqual(expectedAction);
    });
    it("closeSlotDialog", () => {
      const expectedAction = {
        type: types.TOGGLE_SLOT_DIALOG,
        showDialog: false
      };
      expect(actions.closeSlotDialog()).toEqual(expectedAction);
    });
    it("progressSlotDialogSuccess", () => {
      const message = "some message";
      const expectedAction = {
        type: types.PROGRESS_SLOT_DIALOG_SUCCESS,
        showProgress: true,
        state: "success",
        message: message
      };
      expect(actions.progressSlotDialogSuccess(message)).toEqual(
        expectedAction
      );
    });
    it("progressSlotDialogFailed", () => {
      const message = "some message";
      const expectedAction = {
        type: types.PROGRESS_SLOT_DIALOG_FAILED,
        showProgress: true,
        state: "failed",
        message: message
      };
      expect(actions.progressSlotDialogFailed(message)).toEqual(expectedAction);
    });
    it("progressSlotDialogWait", () => {
      const message = "Wait for save";
      const expectedAction = {
        type: types.PROGRESS_SLOT_DIALOG_WAIT,
        showProgress: true,
        state: "waitForSave",
        message: message
      };
      expect(actions.progressSlotDialogWait(message)).toEqual(expectedAction);
    });
    it("selectSlotById", () => {
      const slots = {};
      const slotId = 0;
      const expectedAction = {
        type: types.SELECT_SLOT_BY_ID,
        slots: slots,
        id: slotId
      };
      expect(actions.selectSlotById(slots, slotId)).toEqual(expectedAction);
    });
    it("discardSlotProgressWait", () => {
      const expectedAction = {
        type: types.DISCARD_PROGRESS_WAIT,
        message: "",
        discardState: false,
        showProgress: true
      };
      expect(actions.discardSlotProgressWait()).toEqual(expectedAction);
    });
    it("discardSlotProgressWait", () => {
      const expectedAction = {
        type: types.DISCARD_PROGRESS_WAIT,
        message: "",
        discardState: false,
        showProgress: true
      };
      expect(actions.discardSlotProgressWait()).toEqual(expectedAction);
    });
    it("discardSlotProgressSuccess", () => {
      const message = "some message";
      const expectedAction = {
        type: types.DISCARD_PROGRESS_SUCCESS,
        message: message,
        discardState: true,
        showProgress: true
      };
      expect(actions.discardSlotProgressSuccess(message)).toEqual(
        expectedAction
      );
    });
    it("discardSlotProgressFailed", () => {
      const message = "some message";
      const expectedAction = {
        type: types.DISCARD_PROGRESS_FAILED,
        message: message,
        discardState: false,
        showProgress: true
      };
      expect(actions.discardSlotProgressFailed(message)).toEqual(
        expectedAction
      );
    });
    it("discardSlotProgressReset", () => {
      const expectedAction = {
        type: types.DISCARD_PROGRESS_RESET,
        message: "",
        discardState: false,
        showProgress: false
      };
      expect(actions.discardSlotProgressReset()).toEqual(expectedAction);
    });
    it("unselectSlot", () => {
      const expectedAction = {
        type: types.UNSELECT_SLOT
      };
      expect(actions.unselectSlot()).toEqual(expectedAction);
    });
    it("fetchSlotsFromServer", () => {
      const slots = [];
      const expectedAction = {
        type: types.FETCH_SLOTS_FROM_SERVER,
        slots: slots
      };
      expect(actions.fetchSlotsFromServer(slots)).toEqual(expectedAction);
    });
    it("showDeleteDialog", () => {
      const expectedAction = {
        type: types.TOGGLE_DELETE_SLOT_DIALOG,
        showDeleteDialog: true
      };
      expect(actions.showDeleteDialog()).toEqual(expectedAction);
    });
    it("hideDeleteDialog", () => {
      const expectedAction = {
        type: types.TOGGLE_DELETE_SLOT_DIALOG,
        showDeleteDialog: false
      };
      expect(actions.hideDeleteDialog()).toEqual(expectedAction);
    });
  });
});
