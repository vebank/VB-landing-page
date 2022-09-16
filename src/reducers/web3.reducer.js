import { web3Constants } from '../constants';

const initialState = {
  web3: null,
  connex: null,
  signer: null,
  account: localStorage.getItem('_acc') || null
};

export function web3(state = initialState, action) {
  switch (action.type) {
    case web3Constants.WEB3_CONNECT:
      return {
        ...state,
        connex: action.connex,
        account: action.account,
        web3: action.web3
      };
    case web3Constants.WEB3_DISCONNECT:
      return {
        ...state,
        connex: null,
        account: null,
        web3: null
      };
    default:
      return state;
  }
}

export const selectWeb3 = state => state.web3;
export const selectAccount = state => state.web3.account;