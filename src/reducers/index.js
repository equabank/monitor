import { combineReducers } from "redux";
import slots, * as fromSlots from "./slots";

export default combineReducers({ slots });

export const getStateSlotDialog = state => {
  return fromSlots.getStateSlotDialog(state.slots.showTimeSlotDialog);
};
