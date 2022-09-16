import { poolConstants } from "../constants";

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

export function poolReducer(state = initialState, action) {
  switch (action.type) {
    case poolConstants.MODAL_OPEN_ADD_LIQUIDITY:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_ERROR:
      return {
        ...state,
        pending: false,
        ...action,
      };

    case poolConstants.MODAL_CLOSE_ADD_LIQUIDITY:
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

export const selectPoolReducer = (state) => state.poolReducer;
