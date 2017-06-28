import * as types from "../constants/ActionTypes";

const setShowSlotDialog = () => ({
  type: types.TOGGLE_SLOT_DIALOG,
  show: true
});

const setHideSlotDialog = () => ({
  type: types.TOGGLE_SLOT_DIALOG,
  show: false
});

export const openSlotDialog = () => dispatch => {
  dispatch(setShowSlotDialog());
};

export const closeSlotDialog = () => dispatch => {
  dispatch(setHideSlotDialog());
};
