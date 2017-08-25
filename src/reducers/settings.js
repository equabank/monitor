import { combineReducers } from "redux";
import {
  TOGGLE_ALLOW_SLOT_VALIDATOR,
  FETCH_SETTINGS_FROM_SERVER,
  PROGRESS_SETTINGS_SAVE_SUCCESS,
  PROGRESS_SETTINGS_SAVE_FAILED,
  PROGRESS_SETTINGS_SAVE_RESET,
  TOOGLE_MESSAGE_BOX
} from "../constants/ActionTypes";
import Moment from "moment";

const initialState = {
  allowSlotValidator: false,
  progressSettingsSave: {
    showProgress: false,
    state: false,
    message: ""
  },
  messageBox: {
    message: "Without text message",
    color: "notice",
    endTime: Moment().format("HH:mm:ss")
  }
};

export const toggleSlotValidator = (
  state = initialState.allowSlotValidator,
  action
) => {
  switch (action.type) {
    case TOGGLE_ALLOW_SLOT_VALIDATOR:
      return action.allowSlotValidator;
    case FETCH_SETTINGS_FROM_SERVER:
      return action.settings[0]._source.generatorSlotValidatorAllow;
    default:
      return state;
  }
};

export const toogleMessageBox = (state = initialState.messageBox, action) => {
  switch (action.type) {
    case TOOGLE_MESSAGE_BOX:
      return Object.assign({}, state, {
        message: action.message,
        color: action.color,
        endTime: action.endTime
      });
    default:
      return state;
  }
};

export const getStateAllowSlotValidator = (
  state = initialState.allowSlotValidator
) => {
  return state;
};

export const progressSettingsSave = (
  state = initialState.progressSettingsSave,
  action
) => {
  switch (action.type) {
    case PROGRESS_SETTINGS_SAVE_SUCCESS:
    case PROGRESS_SETTINGS_SAVE_FAILED:
      return Object.assign({}, state, {
        showProgress: action.showProgress,
        state: action.state,
        message: action.message
      });
    case PROGRESS_SETTINGS_SAVE_RESET:
      return Object.assign({}, state, initialState.progressSettingsSave);
    default:
      return state;
  }
};

export const getProgressSettings = (
  state = initialState.progressSettingsSave
) => {
  return state;
};

export const getMessageBoxSettings = (state = initialState.messageBox) => {
  return state;
};

export default combineReducers({
  toggleSlotValidator,
  progressSettingsSave,
  toogleMessageBox
});
