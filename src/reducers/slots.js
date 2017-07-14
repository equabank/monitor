import { combineReducers } from "redux";
import {
  TOGGLE_SLOT_DIALOG,
  PROGRESS_SLOT_DIALOG_SUCCESS,
  PROGRESS_SLOT_DIALOG_FAILED,
  PROGRESS_SLOT_DIALOG_RESET,
  PROGRESS_SLOT_DIALOG_WAIT,
  FETCH_SLOTS_FROM_SERVER,
  SELECT_SLOT_BY_ID,
  UNSELECT_SLOT,
  TOGGLE_DELETE_SLOT_DIALOG,
  DISCARD_PROGRESS_SUCCESS,
  DISCARD_PROGRESS_FAILED,
  DISCARD_PROGRESS_WAIT,
  DISCARD_PROGRESS_RESET
} from "../constants/ActionTypes";

const initialState = {
  showTimeSlotDialog: false,
  progress: {
    showProgress: false,
    state: "none",
    message: ""
  },
  slots: [],
  slot: {},
  showDeleteSlotDialog: false,
  progressDiscard: {
    message: "",
    discardState: false,
    showProgress: false
  }
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

export const showDeleteSlotDialog = (
  state = initialState.showDeleteSlotDialog,
  action
) => {
  switch (action.type) {
    case TOGGLE_DELETE_SLOT_DIALOG:
      return action.showDeleteDialog;
    default:
      return state;
  }
};

export const progressSlotDialog = (state = initialState.progress, action) => {
  switch (action.type) {
    case PROGRESS_SLOT_DIALOG_SUCCESS:
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

export const progressDiscard = (
  state = initialState.progressDiscard,
  action
) => {
  switch (action.type) {
    case DISCARD_PROGRESS_SUCCESS:
    case DISCARD_PROGRESS_FAILED:
    case DISCARD_PROGRESS_WAIT:
      return Object.assign({}, state, {
        message: action.message,
        discardState: action.discardState,
        showProgress: action.showProgress
      });
    case DISCARD_PROGRESS_RESET:
      return Object.assign({}, state, initialState.progressDiscard);
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
      let selectedSlot = {};
      for (let slot of action.slots) {
        if (slot.id === action.id) {
          selectedSlot = slot;
        }
      }
      return Object.assign({}, state, selectedSlot);
    case UNSELECT_SLOT:
      return initialState.slot;
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

export const getProgressDiscardSlot = (
  state = initialState.progressDiscard
) => {
  return state;
};

export const getStateDeleteSlotDialog = (
  state = initialState.showDeleteSlotDialog
) => {
  return state;
};

export default combineReducers({
  showTimeSlotDialog,
  progressSlotDialog,
  selectSlotById,
  slots,
  showDeleteSlotDialog,
  progressDiscard
});
