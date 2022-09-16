import { combineReducers } from "redux";
import { destroyConstants } from "../constants";

/* AUTH */
import { alert } from "./alert.reducer";
import { web3 } from "./web3.reducer";

import { contractVB } from "./contractVB.reducer";
import { contractVET } from "./contractVET.reducer";

import { accountAssetsReducer } from "./accountAssets.reducer";
import { accountOverviewReducer } from "./accountOverview.reducer";

import { assetsMarketReducer } from "./assetsMarket.reducer";
import { assetsPriceReducer } from "./assetsPrice.reducer";
import { assetsPoolReducer } from "./assetsPool.reducer";

import { borrowReducer } from "./borrow.reducer";
import { supplyReducer } from "./supply.reducer";
import { withdrawReducer } from "./withdraw.reducer";
import { repayReducer } from "./repay.reducer";
import { claimRewardsReducer } from "./claim.reducer";
import { poolReducer } from "./pool.reducer";
import { liquidReducer } from "./liquid.reducer";

import { stakeReducer } from "./stake.reducer";
import { unStakeReducer } from "./unstake.reducer";
import { claimStakedReducer } from "./claimStaked.reducer";

import { farmReducer } from "./farm.reducer";
import { unFarmReducer } from "./unfarm.reducer";
import accountBalances from "./accountBalance.reducer";
import userAssetPools from "./userAssetPools.reducer";
import removeLiquidity from "./removeLiquidity.reducer";
import swapAsset from "./swap.reducer";


import { accountStakedVBReducer } from "./accountStakedVB.reducer";

import { accountStakedVETVBReducer } from "./accountStakedVETVB.reducer";

const appReducer = combineReducers({
  alert,
  web3,
  contractVB,
  contractVET,

  accountOverviewReducer,
  accountAssetsReducer,

  assetsMarketReducer,
  assetsPriceReducer,
  assetsPoolReducer,

  borrowReducer,
  supplyReducer,
  withdrawReducer,
  repayReducer,
  claimRewardsReducer,

  poolReducer,
  liquidReducer,

  stakeReducer,
  unStakeReducer,
  claimStakedReducer,

  farmReducer,
  unFarmReducer,
  accountBalances,
  userAssetPools,
  removeLiquidity,
  swapAsset,

  accountStakedVBReducer,
  accountStakedVETVBReducer
  
});

const rootReducer = (state, action) => {
  if (action.type === destroyConstants.DESTROY_SESSION) state = undefined;

  return appReducer(state, action);
};

export default rootReducer;
