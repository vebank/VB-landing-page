import { farmConstants } from "../constants";

const initialState = {
  isOpen: false,
  pending: false,

  transaction: null,
  errorCode: null,
  message: null,

  accountBalance: 0,
  accountApprove: 0,
  accountStableDebtApprove: 0,
  accountVariableDebtApprove: 0,

  dataToken: null,
  data: {},
};

export function unFarmReducer(state = initialState, action) {
  switch (action.type) {
    case farmConstants.MODAL_OPEN_UNFARM:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case farmConstants.MODAL_CLOSE_UNFARM:
      return {
        ...state,
        isOpen: false,
        transaction: null,
        pending: true,
      };

    case farmConstants.MODAL_UNFARM_REQUEST:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case farmConstants.MODAL_UNFARM_SUCCESS:
      return {
        ...state,
        pending: false,
        ...action,
      };

    case farmConstants.MODAL_UNFARM_ERROR:
      return {
        ...state,
        isOpen: false,
        pending: false,
        transaction: null,
        data: {},
        message: null,
      };

    default:
      return state;
  }
}

export const selectUnFarmReducer = (state) => state.unFarmReducer;
