import { marketplaceConstants } from '../constants';

const initialState = {

  isOpen: false,
  pending: false,
  loading:false,

  transaction: null,
  errorCode: null,
  message: null,

  accountBalance: 0,
  accountApprove: 0,
  assetThreshold:0,
  
  dataToken: null,
  data: {}

};

export function withdrawReducer(state = initialState, action) {

  switch (action.type) {

    case marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        transaction: null,
        ...action
      };

    case marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true
      };

    case marketplaceConstants.MODAL_WITHDRAW_MARKET_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction
      };

    case marketplaceConstants.MODAL_WITHDRAW_MARKET_ERROR:
      return {
        ...state,
        pending: false,
        ...action
      };

    case marketplaceConstants.MODAL_CLOSE_WITHDRAW_MARKET:
      return {
        ...state,
        isOpen: false,
        pending: false,
        transaction: null,
        accountBalance: 0,
        data: {},
        message: null
      };

    default:
      return state;
  }
}