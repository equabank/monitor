import * as types from "../constants/ActionTypes";

const setShowSlotDialog = () => ({
  type: types.TOGGLE_SLOT_DIALOG,
  showDialog: true
});

const setHideSlotDialog = () => ({
  type: types.TOGGLE_SLOT_DIALOG,
  showDialog: false
});

const setProgressSlotDialogSuccess = message => ({
  type: types.PROGRESS_SLOT_DIALOG_SUCESS,
  showProgress: true,
  state: "success",
  message: message
});

const setProgressSlotDialogFailed = message => ({
  type: types.PROGRESS_SLOT_DIALOG_FAILED,
  showProgress: true,
  state: "failed",
  message: message
});

const setProgressSlotDialogReset = () => ({
  type: types.PROGRESS_SLOT_DIALOG_RESET,
  showProgress: false,
  state: "none",
  message: "Reset progress"
});

const setProgressSlotDialogWait = () => ({
  type: types.PROGRESS_SLOT_DIALOG_WAIT,
  showProgress: true,
  state: "waitForSave",
  message: "Wait for save"
});

export const selectSlotById = (slots, slotId) => dispatch => {
  dispatch({
    type: types.SELECT_SLOT_BY_ID,
    slots: slots,
    id: slotId
  });
};

export const fetchSlotsFromServer = slots => dispatch => {
  dispatch({
    type: types.FETCH_SLOTS_FROM_SERVER,
    slots: slots
  });
};

export const openSlotDialog = () => dispatch => {
  dispatch(setShowSlotDialog());
};

export const closeSlotDialog = () => dispatch => {
  dispatch(setProgressSlotDialogReset());
  dispatch(setHideSlotDialog());
};

export const progressSlotDialogSuccess = (message = "") => dispatch => {
  dispatch(setProgressSlotDialogSuccess(message));
};

export const progressSlotDialogFailed = (message = "") => dispatch => {
  dispatch(setProgressSlotDialogFailed(message));
};

export const progressSlotDialogReset = () => dispatch => {
  dispatch(setProgressSlotDialogReset());
};

export const progressSlotDialogWait = () => dispatch => {
  dispatch(setProgressSlotDialogWait());
};
