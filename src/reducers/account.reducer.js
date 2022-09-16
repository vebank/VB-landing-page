import { web3Constants } from '../constants';

const initialState = {
  address: null
};

export function account(state = initialState, action) {
  switch (action.type) {
    case web3Constants.WEB3_GET_ACCOUNT:
      return {
        ...state,
        address: action.account,
      };

    default:
      return state;
  }
}