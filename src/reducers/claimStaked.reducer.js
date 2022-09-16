import { stakeConstants } from '../constants';

const initialState = {

  isOpen: false,
  pending: false,
  loading: false,

  transaction: null,
  errorCode: null,
  message: null,

  accountBalance: null,
  accountBalanceClaim:0,
  accountApprove: 0,
  dataToken: null,
  data: {}

};

export function claimStakedReducer(state = initialState, action) {

  switch (action.type) {

    case stakeConstants.MODAL_OPEN_CLAIM_STAKED_MARKET:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action
      };

    case stakeConstants.MODAL_CLAIM_STAKED_MARKET_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true
      };

    case stakeConstants.MODAL_CLAIM_STAKED_MARKET_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction
      };
      
    case stakeConstants.MODAL_CLAIM_STAKED_MARKET_ERROR:
      return {
        ...state,
        pending: false,
        ...action
      };

    case stakeConstants.MODAL_CLOSE_CLAIM_STAKED_MARKET:
      return {
        ...state,
        isOpen: false,
        pending: false,
        transaction: null,
        accountBalance: null,
        data: {},
        message: null
      };

    default:
      return state;
  }
}