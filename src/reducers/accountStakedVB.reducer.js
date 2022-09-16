import { stakeConstants } from '../constants';

const initialState = {
  
  accountStaked: 0,
  amountPending: 0,
  accountRewards: 0,
  totalSupply: 0,
  stakedAPR: 0,
  perMonth:0,
  accountApproveStake:0,

  UNSTAKE_WINDOW: 0,
  cooldownSeconds: 0,
  stakersCooldowns: 0,
  dueTimeEnd: 0,

  loading: false,
  loadingCooldown:false,

  addressStaking: null,
  contractStaking: null,
  
};

export function accountStakedVBReducer(state = initialState, action) {

  switch (action.type) {

    case stakeConstants.GET_ACCOUNT_STAKED_VB:
      return {
        ...state,
        ...action
      };

    default:
      return state;
  }
}