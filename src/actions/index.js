import * as types from "../constants/ActionTypes";
import { save, load } from "../components/settings/libs/settingsApi";

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

const fetchSettingsFromServer = settings => {
  return {
    type: types.FETCH_SETTINGS_FROM_SERVER,
    settings: settings
  };
};

export const loadSettingsFromServer = () => dispatch => {
  load().then(data => {
    if (data.elastic.responses[0].hits !== undefined) {
      let settings = data.elastic.responses[0].hits.hits;
      dispatch(fetchSettingsFromServer(settings));
    }
  });
};

const progressSettingsSaveSuccess = () => {
  return {
    type: types.PROGRESS_SETTINGS_SAVE_SUCCESS,
    showProgress: true,
    state: true,
    message: "Settings successfully saved."
  };
};

const progressSettingsSaveFailed = message => {
  return {
    type: types.PROGRESS_SETTINGS_SAVE_FAILED,
    showProgress: true,
    state: false,
    message: message
  };
};

const progressSettingsSaveReset = () => {
  return {
    type: types.PROGRESS_SETTINGS_SAVE_RESET,
    showProgress: false,
    state: false,
    message: "Reset progress"
  };
};

export const toogleMessageBox = messageBoxSettings => {
  return {
    type: types.TOOGLE_MESSAGE_BOX,
    message: messageBoxSettings.message,
    color: messageBoxSettings.color,
    endTime: messageBoxSettings.endTime
  };
};

export const saveSettings = () => (dispatch, getState) => {
  const { settings } = getState();
  const payload = {
    generatorSlotValidatorAllow: settings.toggleSlotValidator,
    message: settings.toogleMessageBox.message,
    color: settings.toogleMessageBox.color,
    endTime: settings.toogleMessageBox.endTime
  };
  save(payload)
    .then(data => {
      if (data.elastic._shards.successful === 1) {
        dispatch(progressSettingsSaveSuccess());
      } else {
        dispatch(progressSettingsSaveFailed());
      }
    })
    .catch(err => {
      if (payload.generatorSlotValidatorAllow.allowSlotValidator) {
        dispatch(disallowSlotValidator());
      } else {
        dispatch(allowSlotValidator());
      }
    });

  setTimeout(() => {
    dispatch(progressSettingsSaveReset());
  }, 3000);
};
