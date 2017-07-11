import * as types from "../constants/ActionTypes";

export const openSlotDialog = () => dispatch => {
  dispatch({
    type: types.TOGGLE_SLOT_DIALOG,
    showDialog: true
  });
};

const setHideSlotDialog = () => ({
  type: types.TOGGLE_SLOT_DIALOG,
  showDialog: false
});

const setProgressSlotDialogSuccess = message => ({
  type: types.PROGRESS_SLOT_DIALOG_SUCCESS,
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

const setDiscardSlotProgressWait = () => ({
  type: types.DISCARD_PROGRESS_WAIT,
  message: "",
  discardState: false,
  showProgress: true
});

const setDiscardSlotProgressSuccess = message => ({
  type: types.DISCARD_PROGRESS_SUCCESS,
  message: message,
  discardState: true,
  showProgress: true
});

const setDiscardSlotProgressFailed = message => ({
  type: types.DISCARD_PROGRESS_FAILED,
  message: message,
  discardState: false,
  showProgress: true
});

const setDiscardSlotProgressReset = () => ({
  type: types.DISCARD_PROGRESS_RESET,
  message: "",
  discardState: false,
  showProgress: false
});

const setUnselectSlot = () => ({ type: types.UNSELECT_SLOT });

export const fetchSlotsFromServer = slots => dispatch => {
  dispatch({
    type: types.FETCH_SLOTS_FROM_SERVER,
    slots: slots
  });
};

const setShowDeleteSlotDialog = () => ({
  type: types.TOGGLE_DELETE_SLOT_DIALOG,
  showDeleteDialog: true
});

const setHideDeleteSlotDialog = () => ({
  type: types.TOGGLE_DELETE_SLOT_DIALOG,
  showDeleteDialog: false
});

export const unselectSlot = () => dispatch => {
  dispatch(setHideDeleteSlotDialog());
  dispatch(setUnselectSlot());
};

export const showDeleteDialog = () => dispatch => {
  dispatch(setShowDeleteSlotDialog());
};

export const hideDeleteDialog = () => dispatch => {
  dispatch(setHideDeleteSlotDialog());
  dispatch(setUnselectSlot());
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

export const discardSlotProgressWait = () => dispatch => {
  dispatch(setDiscardSlotProgressWait());
};

export const discardSlotProgressSuccess = message => dispatch => {
  dispatch(setDiscardSlotProgressSuccess(message));
};

export const discardSlotProgressFailed = message => dispatch => {
  dispatch(setDiscardSlotProgressFailed(message));
};

export const discardSlotProgressReset = () => dispatch => {
  dispatch(setDiscardSlotProgressReset());
};
