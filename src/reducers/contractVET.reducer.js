import { web3Constants } from '../constants';

const initialState = {
  contractVET: null,
  balance: 0
};

export function contractVET(state = initialState, action) {
  switch (action.type) {

    case web3Constants.INIT_CONTRACT_VET:

      return {
        ...state,
        ...action
      };

    default:
      return state;
  }
}