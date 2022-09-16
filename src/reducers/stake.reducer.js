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

  isSubscribeListener: false,
  stakeTransferEvent:null,

  isSubscribeListener_VETVB: false,
  stakeTransferEvent_VETVB:null,

  dataToken: null,
  data: {},
};

export function stakeReducer(state = initialState, action) {
  switch (action.type) {
    case stakeConstants.MODAL_OPEN_STAKE:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case stakeConstants.MODAL_CLOSE_STAKE:
      return {
        ...state,
        isOpen: false,
        transaction: null,
        pending: true,
      };

    case stakeConstants.MODAL_STAKE_REQUEST:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case stakeConstants.MODAL_STAKE_SUCCESS:
      return {
        ...state,
        pending: false,
        isOpen:false,
        ...action,
      };

    case stakeConstants.MODAL_STAKE_ERROR:
      return {
        ...state,
        pending: false,
        ...action
      };

    default:
      return state;
  }
}

export const selectStakeReducer = (state) => state.stakeReducer;
