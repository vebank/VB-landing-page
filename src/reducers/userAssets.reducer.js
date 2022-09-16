import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "@vechain/ethers";
import ERC20ABI_VB from "../_contracts/VB.json";

const initialState = {
    ids: [],
    data: {},
};

export const fetchUserAssets = createAsyncThunk('user/fetchAssets', async ({dispatch, getState}) => {
    const state = getState();

    const { web3, account } = state.web3;

    if (web3 && account) {
      let contractVB = new web3.eth.Contract(ERC20ABI_VB, process.env.REACT_APP_TOKEN_VEBANK);

      let balance = 0;

      if (contractVB && account) {
        const balanceBigN = await contractVB.methods.balanceOf(account).call();
        balance = ethers.utils.formatEther(balanceBigN);
        balance = Math.round(balance * 100) / 100;
      }

      return balance;
    }
})

const userAssetsSlice = createSlice({
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase()
    }
})