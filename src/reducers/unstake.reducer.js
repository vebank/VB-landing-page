import { stakeConstants } from "../constants";

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

export function unStakeReducer(state = initialState, action) {
  switch (action.type) {
    case stakeConstants.MODAL_OPEN_UNSTAKE:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case stakeConstants.MODAL_CLOSE_UNSTAKE:
      return {
        ...state,
        isOpen: false,
        transaction: null,
        pending: true,
      };

    case stakeConstants.MODAL_UNSTAKE_REQUEST:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case stakeConstants.MODAL_UNSTAKE_SUCCESS:
      return {
        ...state,
        pending: false,
        isOpen:false,
        ...action,
      };

    case stakeConstants.MODAL_UNSTAKE_ERROR:
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

export const selectUnStakeReducer = (state) => state.unStakeReducer;
