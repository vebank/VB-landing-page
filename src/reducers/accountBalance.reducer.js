import { createSlice, createSelector } from "@reduxjs/toolkit";
import { instantiateVEUSDContracts } from "../actions";
import { web3Constants } from "../constants";
import { selectListAssets } from "./assetsMarket.reducer";

const initialState = {
  ids: [],
  entities: {},
};

const accountBalanceSlice = createSlice({
  name: "accountBalances",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(web3Constants.INIT_CONTRACT_VB, (state, action) => {
        if (action.contractVB) {
          if (!state.ids.includes(action.contractVB.assetsAddress)) {
            state.ids.push(action.contractVB.options.address);
          }
          if (state?.entities) {
            state.entities[action.contractVB.options.address] =
              action.balance || 0;
          }
        }
      })
      .addCase(web3Constants.INIT_CONTRACT_NEW_TOKEN, (state, action) => {
        if (action.contractToken) {
          if (!state.ids.includes(action.contractToken.assetsAddress)) {
            state.ids.push(action.contractToken.options.address);
          }
          if (state?.entities) {
            state.entities[action.contractToken.options.address] =
            action.balance || 0;
          }
        }
      })
      .addCase(instantiateVEUSDContracts.fulfilled, (state, action) => {
        if (action.payload) {
          const { contractVEUSD, balance } = action.payload;
          if (!state.ids.includes(contractVEUSD.options.address)) {
            state.ids.push(contractVEUSD.options.address);
          }
          if (state?.entities) {
            state.entities[contractVEUSD.options.address] = balance || 0;
          }
        }
      })
      .addCase(web3Constants.INIT_CONTRACT_VET, (state, action) => {
        if (!state.ids.includes(process.env.REACT_APP_TOKEN_WVET)) {
          state.ids.push(process.env.REACT_APP_TOKEN_WVET);
        }
        if (!state.ids.includes(process.env.REACT_APP_TOKEN_VTHO)) {
          state.ids.push(process.env.REACT_APP_TOKEN_VTHO);
        }
        if (state?.entities) {
          state.entities[process.env.REACT_APP_TOKEN_WVET] =
            action.balanceVET || 0;
          state.entities[process.env.REACT_APP_TOKEN_VTHO] =
            action.balanceVTHO || 0;
        }
      })
      .addCase(web3Constants.ON_VET_BALANCE_CHANGED, (state, action) => {
        state.entities[process.env.REACT_APP_TOKEN_WVET] = action.payload || 0;
      })
      .addCase(web3Constants.ON_VTHO_BALANCE_CHANGED, (state, action) => {
        state.entities[process.env.REACT_APP_TOKEN_VTHO] = action.payload || 0;
      })
      .addCase(web3Constants.WEB3_DISCONNECT, (state, _) => {
        // Reset all user's asset balances to 0
        state.ids.forEach((assetAddress) => (state.entities[assetAddress] = 0));
      });
  },
});

export default accountBalanceSlice.reducer;
export const selectBalancesIds = (state) => state.accountBalances.ids;
export const selectBalanceById = (state, id) =>
  state.accountBalances.entities[id];
const selectAllBalances = (state) => state.accountBalances.entities;
const _selectUserAssetsBalance = createSelector(
  [selectListAssets, selectAllBalances],
  (listAssets, entities) => {

    if (listAssets && listAssets.length > 0) {

      let assetsList = [];
      for (const asset of listAssets) {
         if(asset.isActive === true){
           assetsList.push({
             ...asset,
             balance: entities?.[asset.assetsAddress] || 0,
           });
         }
      }
      // const assetsList = listAssets.map((asset) => {
      //   return {
      //     ...asset,
      //     balance: entities?.[asset.assetsAddress] || 0,
      //   };
      // });
      return assetsList.sort((a, b) => b.balance - a.balance);
    }
  }
);
const _selectUserAssetsBalanceSortLowest = createSelector(
  [selectListAssets, selectAllBalances],
  (listAssets, entities) => {
    if (listAssets && listAssets.length > 0) {

       let assetsList =[];
       for (const asset of listAssets) {
          if(asset.isActive === true){
            assetsList.push({
              ...asset,
              balance: entities?.[asset.assetsAddress] || 0,
            });
          }
       }

      // const assetsList = listAssets.map((asset) => {
      //   return {
      //     ...asset,
      //     balance: entities?.[asset.assetsAddress] || 0,
      //   };
      // });

      return assetsList.sort((a, b) => a.balance - b.balance);
    }
  }
);
export const selectUserAssetsBalance = (state) =>
  _selectUserAssetsBalance(state);

export const selectUserAssetsBalanceSortLowest = (state) =>
  _selectUserAssetsBalanceSortLowest(state);
