import { combineReducers } from "redux";
import {
  TOGGLE_SLOT_DIALOG,
  PROGRESS_SLOT_DIALOG_SUCESS,
  PROGRESS_SLOT_DIALOG_FAILED,
  PROGRESS_SLOT_DIALOG_RESET,
  PROGRESS_SLOT_DIALOG_WAIT,
  FETCH_SLOTS_FROM_SERVER,
  SELECT_SLOT_BY_ID
} from "../constants/ActionTypes";

const initialState = {
  showTimeSlotDialog: false,
  progress: {
    showProgress: false,
    state: "none",
    message: ""
  },
  slots: [],
  slot: {}
};

export const showTimeSlotDialog = (
  state = initialState.showTimeSlotDialog,
  action
) => {
  switch (action.type) {
    case TOGGLE_SLOT_DIALOG:
      return action.showDialog;
    default:
      return state;
  }
};

export const progressSlotDialog = (state = initialState.progress, action) => {
  switch (action.type) {
    case PROGRESS_SLOT_DIALOG_SUCESS:
    case PROGRESS_SLOT_DIALOG_FAILED:
    case PROGRESS_SLOT_DIALOG_WAIT:
      return Object.assign({}, state, {
        showProgress: action.showProgress,
        state: action.state,
        message: action.message
      });
    case PROGRESS_SLOT_DIALOG_RESET:
      return Object.assign({}, state, initialState.progress);
    default:
      return state;
  }
};

export const slots = (state = initialState.slots, action) => {
  switch (action.type) {
    case FETCH_SLOTS_FROM_SERVER:
      return action.slots;
    default:
      return state;
  }
};

export const selectSlotById = (state = initialState.slot, action) => {
  switch (action.type) {
    case SELECT_SLOT_BY_ID:
      for (let slot of action.slots) {
        if (slot.id === action.id) {
          return Object.assign({}, state, slot);
        }
      }
      return state;
    default:
      return state;
  }
};

export const getStateSlotDialog = (state = initialState.showTimeSlotDialog) => {
  return state;
};

export const getProgressSlotDialog = (state = initialState.progress) => {
  return state;
};

export const getSelectedSlot = (state = initialState.slot) => {
  return state;
};

export const getSlots = (state = initialState.slots) => {
  return state;
};

export default combineReducers({
  showTimeSlotDialog,
  progressSlotDialog,
  selectSlotById,
  slots
});
