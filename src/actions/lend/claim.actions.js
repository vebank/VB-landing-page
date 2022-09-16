import { ethers, FixedNumber } from "ethers";
import { marketplaceConstants } from "../../constants";
import * as actions from "../";

import ERC20ABI_POOL from "../../_contracts/lend/Pool.json";
import ERCABI_REWARD from "../../_contracts/lend/RewardsController.json";
import ERCABI_UIINCENTIVE from "../../_contracts/lend/UiIncentiveDataProviderV3.json";
import {
  fixedBalanceEtherZero,
  randomKeyUUID,
  addressWalletCompact,
} from "../../utils/lib";
// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;
const ADDRESS_REWARD = process.env.REACT_APP_REWARD_CONTROLLER;

export const loadModalClaim = () => async (dispatch, getState) => {
  const state = getState();

  const { web3, account } = state.web3;

  const dataAccountAssets = state.accountAssetsReducer.data;

  let accountApprove = 0;
  let accountBalance = 0;
  let dataList = [];

  dispatch({
    type: marketplaceConstants.MODAL_OPEN_CLAIM_REWARDS_MARKET,
    loading: true,
    accountApprove,
    accountBalance,
  });

  if (web3 && account && dataAccountAssets) {
    const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);
    const { data } = state.assetsMarketReducer;

    let dataAssets = [];
    data.map((item) => {
      dataAssets.push(item.aTokenAddress);
      dataAssets.push(item.variableDebtTokenAddress);
    });

    if (contractPOOL && account && dataAssets.length > 0) {
      if (ADDRESS_REWARD) {
        const contractREWARD = new web3.eth.Contract(
          ERCABI_REWARD,
          ADDRESS_REWARD
        );

        try {
          accountBalance = await contractREWARD.methods
            .getUserRewards(
              dataAssets,
              account,
              process.env.REACT_APP_TOKEN_VEBANK
            )
            .call();

          if (accountBalance) {
            accountBalance = ethers.utils.formatUnits(accountBalance, 18);
          }
        } catch (error) {
          console.log("error getUserAccountData:", error);
        }

        dispatch({
          type: marketplaceConstants.MODAL_OPEN_CLAIM_REWARDS_MARKET,
          loading: false,
          accountApprove,
          accountBalance,
        });

        dispatch(actions.getAccountOverview());

        
      }
    }
  }

  return dataList;
};

export const claimReward = (amoutClaim) => async (dispatch, getState) => {
  const state = getState();

  const { account, connex, web3 } = state.web3;

  let dataAssets = [];

  if (connex && account && ADDRESS_REWARD) {
    const { data } = state.assetsMarketReducer;

    data.map((item) => {
      dataAssets.push(item.aTokenAddress);
      dataAssets.push(item.variableDebtTokenAddress);
    });

    try {
      const key = randomKeyUUID();
      const claimABI = ERCABI_REWARD.find(
        ({ name, type }) => name === "claimRewardsToSelf" && type === "function"
      );

      const valueAmount = web3.utils.toWei(amoutClaim.toString());
      const methodClaim = connex.thor.account(ADDRESS_REWARD).method(claimABI);

      methodClaim
        .transact(dataAssets, valueAmount, process.env.REACT_APP_TOKEN_VEBANK)
        .comment(`transfer to Claim VeBank`)
        .request()
        .then((transaction) => {
          dispatch({
            type: marketplaceConstants.MODAL_CLAIM_REWARDS_SUCCESS,
            transaction: 1,
          });
          
          dispatch(
            actions.alertActions.success({
              title: "Claim successfully!",
              description: `Wallet ${addressWalletCompact(transaction.signer)}`,
            })
          );
          
          dispatch(actions.closeModalClaim());
          return transaction;
        })
        .catch((e) => {
          console.log("error----", e);
          dispatch({
            type: marketplaceConstants.MODAL_CLAIM_REWARDS_ERROR,
          });
          // dispatch(
          //   actions.alertActions.update(
          //     {
          //       status: "warning",
          //       title: "Transaction Supply Rejected",
          //       description: e.message,
          //     },
          //     key
          //   )
          // );
          dispatch(
            actions.alertActions.warning({
              title: "Claim failed!",
              description: `Wallet ${addressWalletCompact(account)}`,
            })
          );
          dispatch(actions.closeModalClaim());
          return e;
        });
    } catch (error) {
      console.log("error ----:", error);
    }
  }

  // return dataList;
};

export const closeModalClaim = () => (dispatch) => {
  dispatch({
    type: marketplaceConstants.MODAL_CLOSE_CLAIM_REWARDS_MARKET,
  });
};
