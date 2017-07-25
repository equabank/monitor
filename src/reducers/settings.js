import { combineReducers } from "redux";
import {
  TOGGLE_ALLOW_SLOT_VALIDATOR,
  FETCH_SETTINGS_FROM_SERVER
} from "../constants/ActionTypes";

const initialState = {
  allowSlotValidator: false
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

export const getStateAllowSlotValidator = (
  state = initialState.allowSlotValidator
) => {
  return state;
};

export default combineReducers({
  toggleSlotValidator
});
