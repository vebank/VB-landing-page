import { web3Constants } from '../constants';

const initialState = {
  contractVB: null,
  balance: 0
};

export function contractVB(state = initialState, action) {
  switch (action.type) {

    case web3Constants.INIT_CONTRACT_VB:

      return {
        ...state,
        ...action
      };

    default:
      return state;
  }
}