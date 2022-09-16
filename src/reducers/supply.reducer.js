import { marketplaceConstants } from '../constants';

const initialState = {

  isOpen: false,
  pending: false,

  transaction: null,
  errorCode: null,
  message: null,

  accountBalance: 0,
  accountApprove: 0,
  dataToken: null,
  data: {}

};

export function supplyReducer(state = initialState, action) {

  switch (action.type) {

    case marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET:
      return {
        ...state,
        isOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        transaction: null,
        ...action
      };

    case marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true
      };

    case marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction
      };


    case marketplaceConstants.MODAL_SUPPLY_MARKET_ERROR:
      return {
        ...state,
        pending: false,
        ...action
      };

    case marketplaceConstants.MODAL_CLOSE_SUPPLY_MARKET:
      return {
        ...state,
        isOpen: false,
        pending: false,
        transaction: null,
        data: {},
        message: null
      };

    default:
      return state;
  }
}