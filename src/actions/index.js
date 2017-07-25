import * as types from "../constants/ActionTypes";

export const openSlotDialog = () => {
  return {
    type: types.TOGGLE_SLOT_DIALOG,
    showDialog: true
  };
};

export const closeSlotDialog = () => {
  return {
    type: types.TOGGLE_SLOT_DIALOG,
    showDialog: false
  };
};

export const progressSlotDialogSuccess = message => {
  return {
    type: types.PROGRESS_SLOT_DIALOG_SUCCESS,
    showProgress: true,
    state: "success",
    message: message
  };
};

export const progressSlotDialogFailed = message => {
  return {
    type: types.PROGRESS_SLOT_DIALOG_FAILED,
    showProgress: true,
    state: "failed",
    message: message
  };
};

export const progressSlotDialogReset = () => {
  return {
    type: types.PROGRESS_SLOT_DIALOG_RESET,
    showProgress: false,
    state: "none",
    message: "Reset progress"
  };
};

export const progressSlotDialogWait = () => {
  return {
    type: types.PROGRESS_SLOT_DIALOG_WAIT,
    showProgress: true,
    state: "waitForSave",
    message: "Wait for save"
  };
};

export const selectSlotById = (slots, slotId) => {
  return {
    type: types.SELECT_SLOT_BY_ID,
    slots: slots,
    id: slotId
  };
};

export const discardSlotProgressWait = () => {
  return {
    type: types.DISCARD_PROGRESS_WAIT,
    message: "",
    discardState: false,
    showProgress: true
  };
};

export const discardSlotProgressSuccess = message => {
  return {
    type: types.DISCARD_PROGRESS_SUCCESS,
    message: message,
    discardState: true,
    showProgress: true
  };
};

export const discardSlotProgressFailed = message => {
  return {
    type: types.DISCARD_PROGRESS_FAILED,
    message: message,
    discardState: false,
    showProgress: true
  };
};

export const discardSlotProgressReset = () => {
  return {
    type: types.DISCARD_PROGRESS_RESET,
    message: "",
    discardState: false,
    showProgress: false
  };
};

export const unselectSlot = () => ({ type: types.UNSELECT_SLOT });

export const fetchSlotsFromServer = slots => {
  return {
    type: types.FETCH_SLOTS_FROM_SERVER,
    slots: slots
  };
};

export const showDeleteDialog = () => {
  return {
    type: types.TOGGLE_DELETE_SLOT_DIALOG,
    showDeleteDialog: true
  };
};

export const hideDeleteDialog = () => {
  return {
    type: types.TOGGLE_DELETE_SLOT_DIALOG,
    showDeleteDialog: false
  };
};

export const allowSlotValidator = () => {
  return {
    type: types.TOGGLE_ALLOW_SLOT_VALIDATOR,
    allowSlotValidator: true
  };
};

export const disallowSlotValidator = () => {
  return {
    type: types.TOGGLE_ALLOW_SLOT_VALIDATOR,
    allowSlotValidator: false
  };
};

export const fetchSettingsFromServer = settings => {
  return {
    type: types.FETCH_SETTINGS_FROM_SERVER,
    settings: settings
  };
};
