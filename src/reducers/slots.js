import { combineReducers } from "redux";
import { TOGGLE_SLOT_DIALOG } from "../constants/ActionTypes";

const initialState = {
  showTimeSlotDialog: false,
  necoDalsiho: 0
};

export const showTimeSlotDialog = (
  state = initialState.showTimeSlotDialog,
  action
) => {
  switch (action.type) {
    case TOGGLE_SLOT_DIALOG:
      return action.show;
    default:
      return state;
  }
};

export const getStateSlotDialog = (state = initialState.showTimeSlotDialog) => {
  return state;
};

export default combineReducers({
  showTimeSlotDialog
});
