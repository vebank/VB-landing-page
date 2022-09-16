import { createSlice } from "@reduxjs/toolkit";
import {
  checkApproveToken,
  checkAssetExistsPools,
  checkExchangeRatePool,
  checkTotalSupplyAvailable,
  getAmountsIn,
  getAmountsOut,
  getMaxAmountOut,
  getMinAmountIn,
  getPairsFee,
  onApproveTokenForAccount,
  swapAsset,
} from "../actions";
import { swapConstants } from "../constants";

const initialState = {
  sourceTokenAddress: process.env.REACT_APP_TOKEN_WVET,
  desireTokenAddress: process.env.REACT_APP_TOKEN_VEBANK,
  isModalSelectTokenOpen: false,
  nameToken: swapConstants.FIRST_TOKEN,
  symbolPairs: [],
  exchangeRateAB: 0,
  exchangeRateBA: 0,
  loadingFee: false,
  pairFee: 3,
  loadingGetAmountOut: false,
  loadingGetAmountIn: false,
  accountApprove: 0,
  contractSwap: "",
  poolAddress: "",
  reserves1: null,
  reserves2: null,
  totalSupply: null,
  emptyAddress: true,
  amountsOut: "",
  swapLoading: false,
};

const swapAssetSlice = createSlice({
  name: "swapAsset",
  initialState,
  reducers: {
    selectSourceTokenFromModal: (state, action) => {
      if (action.payload) {
        state.sourceTokenAddress = action.payload;
        state.isModalSelectTokenOpen = false;
      }
    },
    selectDesireTokenFromModal: (state, action) => {
      if (action.payload) {
        state.desireTokenAddress = action.payload;
        state.isModalSelectTokenOpen = false;
      }
    },
    swapTokenDesire: (state, action) => {
      state.isModalSelectTokenOpen = false;
      const sourceAddress = state.sourceTokenAddress;
      const desireAddress = state.desireTokenAddress;
      const tempReserves1 = state.reserves2;
      const tempReserves2 = state.reserves1;
      state.sourceTokenAddress = desireAddress;
      state.desireTokenAddress = sourceAddress;
      state.reserves1 = tempReserves1;
      state.reserves2 = tempReserves2;
    },
    openModalSelectToken: (state, action) => {
      state.isModalSelectTokenOpen = true;
      state.nameToken = action.payload;
    },
    closeModalSelectToken: (state, action) => {
      state.isModalSelectTokenOpen = false;
    },
    getSymbolPairs: (state, action) => {
      state.symbolPairs = action.payload;
    },
    setLoadingSwap: (state, action) => {
      state.swapLoading = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPairsFee.pending, (state, action) => {
        state.loadingFee = true;
      })
      .addCase(getPairsFee.fulfilled, (state, action) => {
        state.loadingFee = false;
        state.pairFee = action.payload;
      })
      .addCase(getPairsFee.rejected, (state, action) => {
        state.loadingFee = false;
      })
      .addCase(getAmountsOut.pending, (state, action) => {
        state.loadingGetAmountOut = true;
      })
      .addCase(getAmountsOut.fulfilled, (state, action) => {
        state.loadingGetAmountOut = false;
        state.amountsOut = action.payload.amountsOutFormat;
      })
      .addCase(getAmountsOut.rejected, (state, action) => {
        state.loadingGetAmountOut = false;
      })
      .addCase(getMaxAmountOut.pending, (state, action) => {
        state.loadingGetAmountOut = true;
      })
      .addCase(getMaxAmountOut.fulfilled, (state, action) => {
        state.loadingGetAmountOut = false;
        state.amountsOut = action.payload.amountOutMax;
      })
      .addCase(getMaxAmountOut.rejected, (state, action) => {
        state.loadingGetAmountOut = false;
      })
      .addCase(getAmountsIn.pending, (state, action) => {
        state.loadingGetAmountIn = true;
      })
      .addCase(getAmountsIn.fulfilled, (state, action) => {
        state.loadingGetAmountIn = false;
        state.amountsOut = action.payload.inputAmountOut;
      })
      .addCase(getAmountsIn.rejected, (state, action) => {
        state.loadingGetAmountIn = false;
      })
      .addCase(getMinAmountIn.pending, (state, action) => {
        state.loadingGetAmountIn = true;
      })
      .addCase(getMinAmountIn.fulfilled, (state, action) => {
        state.loadingGetAmountIn = false;
        state.amountsOut = action.payload.amountOut;
      })
      .addCase(getMinAmountIn.rejected, (state, action) => {
        state.loadingGetAmountIn = false;
      })
      .addCase(swapAsset.fulfilled, (state, action) => {
        state.swapLoading = false;
      })
      .addCase(swapAsset.rejected, (state, action) => {
        state.swapLoading = false;
      })
      .addCase(checkApproveToken.fulfilled, (state, action) => {
        state.accountApprove = action.payload.accountApprove;
        state.contractSwap = action.payload.contractSwap;
      })
      .addCase(onApproveTokenForAccount.fulfilled, (state, action) => {
        state.accountApprove = action.payload.accountApprove;
      })
      .addCase(checkAssetExistsPools.fulfilled, (state, action) => {
        state.poolAddress = action.payload.assetsPoolAddress;
        state.emptyAddress = action.payload.emptyAddress;
      })
      .addCase(checkExchangeRatePool.fulfilled, (state, action) => {
        state.reserves1 = action.payload.reserves1;
        state.reserves2 = action.payload.reserves2;
        // state.exchangeRateAB = action.payload.exchangeRateFormatAB;
        // state.exchangeRateBA = action.payload.exchangeRateFormatBA;
      })
      .addCase(checkExchangeRatePool.rejected, (state) => {
        state.reserves1 = "";
        state.reserves2 = "";
      })
      .addCase(checkTotalSupplyAvailable.fulfilled, (state, action) => {
        state.totalSupply = action.payload.totalSupply;
      });
  },
});

export default swapAssetSlice.reducer;

export const {
  swapTokenDesire,
  openModalSelectToken,
  closeModalSelectToken,
  selectSourceTokenFromModal,
  selectDesireTokenFromModal,
  getSymbolPairs,
  setLoadingSwap,
} = swapAssetSlice.actions;

export const selectSourceToken = (state) => state.swapAsset.sourceTokenAddress;
export const selectDesireToken = (state) => state.swapAsset.desireTokenAddress;
export const selectNameTokenState = (state) => state.swapAsset.nameToken;
export const selectOpenChooseTokenState = (state) =>
  state.swapAsset.isModalSelectTokenOpen;
export const selectSymbolPairs = (state) => state.swapAsset.symbolPairs;
export const selectExchangeRateAB = (state) => state.swapAsset.exchangeRateAB;
export const selectExchangeRateBA = (state) => state.swapAsset.exchangeRateBA;
export const selectLoadingFee = (state) => state.swapAsset.loadingFee;
export const selectPairsFee = (state) => state.swapAsset.pairFee;
export const selectLoadingGetAmountOut = (state) =>
  state.swapAsset.loadingGetAmountOut;
export const selectLoadingGetAmountIn = (state) =>
  state.swapAsset.loadingGetAmountIn;
export const selectAccountApprove = (state) => state.swapAsset.accountApprove;
export const selectEmptyAddress = (state) => state.swapAsset.emptyAddress;
export const selectPoolAddress = (state) => state.swapAsset.poolAddress;
export const selectReserveFrom = (state) => state.swapAsset.reserves1;
export const selectReserveTo = (state) => state.swapAsset.reserves2;
export const selectSwapLoading = (state) => state.swapAsset.swapLoading;
