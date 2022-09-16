import { poolConstants, web3Constants } from "../constants";

import IcVeUSD from "../assets/images/ic_veusd.svg";
import IcVeChain from "../assets/images/ic_vechain.svg";
import IcVeBank from "../assets/images/ic_vebank.svg";
import IcVtho from "../assets/images/ic_vtho.svg";
import { FixedNumber } from "ethers";

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  total: 0,
  ids: [],
  entities: {},
  data: [],
  tvl: 0,
  volume: 0,
};

export function assetsPoolReducer(state = initialState, payload) {
  switch (payload.type) {
    case poolConstants.FETCH_POOL_ASSETS_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };

    case poolConstants.FETCH_POOL_ASSETS_SUCCESS: {
      const nextState = {
        ...state,
        requesting: false,
        success: true,
        data: payload.data,
        total: payload.total,
      };
      let tvl = 0;
      let volume = 0;
      for (const pool of payload.data) {
        tvl = FixedNumber.from(tvl.toString())
          .addUnsafe(
            FixedNumber.from(pool.liquidity_usd.toString().slice(0, 18))
          )
          .toString();
        volume = FixedNumber.from(volume.toString())
          .addUnsafe(FixedNumber.from(pool.volume.toString().slice(0, 18)))
          .toString();
        if (!nextState.ids.includes(pool.assetsPoolAddress)) {
          nextState.ids.push(pool.assetsPoolAddress);
        }
        nextState.entities[pool.assetsPoolAddress] = pool;
      }
      nextState.tvl = tvl;
      nextState.volume = volume;
      return nextState;
    }
    case web3Constants.WEB3_DISCONNECT: {
      // When user disconnected account
      const nextState = {
        ...state,
      };
      for (const poolAddress of state.ids) {
        nextState.entities[poolAddress].isSubscribeListener = false;
        nextState.entities[poolAddress].pairApproveEvent?.removeAllListeners();
        nextState.entities[poolAddress].pairTransferEvent?.removeAllListeners();
      }
      return nextState;
    }
    case poolConstants.FETCH_POOL_ASSETS_ERROR:
      return {
        ...state,
        requesting: false,
        message: payload.message,
      };

    default:
      return state;
  }
}

export const selectPoolAddresses = (state) => state.assetsPoolReducer.ids;
export const selectPoolInfoByAddress = (state, address) =>
  state.assetsPoolReducer.entities[address];
export const selectListPoolAddress = (state) =>
  state.assetsPoolReducer.entities;
export const selectTVL = (state) => state.assetsPoolReducer.tvl;
export const selectVolume = (state) => state.assetsPoolReducer.volume;
