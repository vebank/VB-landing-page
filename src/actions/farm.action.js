
import { ethers } from "ethers";
import { farmConstants } from "../constants";

// ------------------------ BORROW ------------------------ //

/**
 *
 * @param {*} dataToken
 * @returns dispatch strore
 *
 */
export const loadModalFarm = (dataToken) => async (dispatch, getState) => {
  const state = getState();
  const { web3, account } = state.web3;

  const dataPrice = state.assetsPriceReducer.data;

  const { accountSupplyBalance } = state.accountAssetsReducer;

  let accountBalance = 0;
  let accountApprove = 0;
  // let contractBorrow;

  let accountStableDebtApprove = 0;
  let accountVariableDebtApprove = 0;

  dispatch({
    type: farmConstants.MODAL_OPEN_FARM,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    accountBalance: accountBalance,
    dataToken,
  });

};
