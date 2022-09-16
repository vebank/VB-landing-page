import { ethers } from "@vechain/ethers";
import Connex from "@vechain/connex";

// import { Certificate, blake2b256, secp256k1 } from "thor-devkit";

import { web3Constants } from "../constants";
import getWeb3 from "../utils/getWeb3";

import * as actions from "./";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addressWalletCompact,
  compareString,
  randomKeyUUID,
} from "../utils/lib";
import assetAbi from "../_contracts/asset-abi";
import abiERC20 from "../_contracts/abi-erc20.json";
import PartialConstants from "../constants/partial.constants";

// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

const TOKEN_VTHO = process.env.REACT_APP_TOKEN_VTHO;
const TOKEN_VET = process.env.REACT_APP_TOKEN_WVET;
const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_VEUSD = process.env.REACT_APP_TOKEN_VEUSD;

export const web3Connect = (isLogin) => async (dispatch) => {

  const web3 = await getWeb3();

  let _acc = localStorage.getItem("_acc");
  let _sign = localStorage.getItem("_sign");

  const connex = new Connex({
    node: process.env.REACT_APP_CHAIN_NETWORK,
    network: process.env.REACT_APP_NAME_NETWORK,
  });

  if (_acc && _sign) {

    dispatch({
      type: web3Constants.WEB3_CONNECT,
      web3,
      connex,
      signer: JSON.parse(_sign),
      account: _acc,
    });

    return _acc;
  } else if (!_acc && isLogin) {
    const key = randomKeyUUID();

    await connex.vendor
    .sign("cert", {
      purpose: "identification",
      payload: {
        type: "text",
        content: "Please sign the certificate to continue purchase",
      },
    })
    .accepted(() => {
      dispatch(
        actions.alertActions.loading(
          {
            title: "Connecting",
            description: `Wallet sync2 waiting...`,
          },
          key
        )
      );
      return _acc;
    })
    .request()
    .then((signer) => {
      _acc = signer.annex.signer;
      _sign = JSON.stringify(signer);

      localStorage.setItem("_acc", _acc);
      localStorage.setItem("_sign", _sign);

      dispatch({
        type: web3Constants.WEB3_CONNECT,
        connex,
        web3,
        signer,
        account: _acc,
      });

      dispatch(
        actions.alertActions.update(
          {
            status: "success",
            title: "Connected",
            description: `Wallet: ${addressWalletCompact(_acc)}`,
          },
          key
        )
      );

      return _acc;
    })
    .catch((e) => {
      dispatch(
        actions.alertActions.update(
          {
            title: "Connect",
            status: "warning",
            description: e.message,
          },
          key
        )
      );
    });

  } else {
    dispatch({
      type: web3Constants.WEB3_CONNECT,
      web3,
      connex,
    });

    return _acc;
  }
};

export const web3Disconnect = () => async (dispatch, getState) => {
  const state = getState();
  const { account } = state.web3;

  localStorage.removeItem("_acc");
  localStorage.removeItem("_sign");

  dispatch({
    type: web3Constants.WEB3_DISCONNECT,
    connex: null,
    web3: null,
    account: null,
  });

  dispatch(
    actions.alertActions.success({
      title: "Disconected",
      description: `Wallet: ${addressWalletCompact(account)}`,
    })
  );

  // setTimeout(() => {
  //     dispatch({ type: destroyConstants.DESTROY_SESSION });
  // }, 1000);
};

export const instantiateVetContracts = () => async (dispatch, getState) => {
  const state = getState();

  const { connex, web3, account } = state.web3;

  if (account) {
    const accInfo = await connex.thor.account(account).get();

    let balanceVET = 0;
    let balanceVTHO = 0;

    if (accInfo && accInfo.balance && accInfo.energy) {
      balanceVET = ethers.utils.formatEther(accInfo.balance);
      balanceVET = Math.round(balanceVET * 100) / 100;

      balanceVTHO = ethers.utils.formatEther(accInfo.energy);
      balanceVTHO = Math.round(balanceVTHO * 100) / 100;
    }

    const contractVET = new web3.eth.Contract(assetAbi[TOKEN_VET], TOKEN_VET);
    if (contractVET) {
      
      contractVET.events.Withdrawal().removeAllListeners?.();
      contractVET.events
        .Withdrawal()
        .on("data", async (data) => {
          const accInfo = await connex.thor.account(account).get();

          let balanceVET = 0;
          let balanceVTHO = 0;

          if (accInfo && accInfo.balance && accInfo.energy) {
            balanceVET = ethers.utils.formatEther(accInfo.balance);
            balanceVET = Math.round(balanceVET * 100) / 100;

            balanceVTHO = ethers.utils.formatEther(accInfo.energy);
            balanceVTHO = Math.round(balanceVTHO * 100) / 100;

            dispatch({
              type: web3Constants.INIT_CONTRACT_VET,
              accInfo,
              balanceVET,
              balanceVTHO,
            });
          }
        })
        .on("error", async (err) => {
          console.log("-------err", err);
        });

      contractVET.events.Transfer({}).removeAllListeners?.();
      contractVET.events
        .Transfer({})
        .on("data", async function (event) {
          const { txOrigin } = event?.meta;

          if (compareString(txOrigin, account)) {

            const accInfo = await connex.thor.account(account).get();

            let balanceVET = 0;
            let balanceVTHO = 0;

            if (accInfo && accInfo.balance && accInfo.energy) {
              balanceVET = ethers.utils.formatEther(accInfo.balance);
              balanceVET = Math.round(balanceVET * 100) / 100;

              balanceVTHO = ethers.utils.formatEther(accInfo.energy);
              balanceVTHO = Math.round(balanceVTHO * 100) / 100;

              dispatch({
                type: web3Constants.INIT_CONTRACT_VET,
                accInfo,
                balanceVET,
                balanceVTHO,
              });
            }
          }
          // balance = Math.round(balance * 100) / 100;
          // dispatch({
          //   type: web3Constants.ON_VET_BALANCE_CHANGED,
          //   payload: balance,
          // });
        })
        .on("changed", (changed) =>
          // When event is attached or removed from the chain
          console.log("🐶🐶  ~ instantiateVetContracts ~ changed", changed)
        )
        .on("error", console.error);
    }

    const contractVTHO = new web3.eth.Contract(
      assetAbi[TOKEN_VTHO],
      TOKEN_VTHO
    );
    if (contractVTHO) {
 
      contractVTHO.events.Withdrawal?.().removeAllListeners?.();
      contractVTHO.events
        .Withdrawal?.()
        .on("data", async (data) => {
          console.log("🐶🐶  ~ contractVTHO.events.Withdrawal ~ data", data);
        })
        .on("error", async (err) => {
          console.log("🐶🐶  ~ contractVTHO.events.Withdrawal ~ err", err);
        });

      contractVTHO.events.Transfer?.().removeAllListeners?.();
      contractVTHO.events
        .Transfer({})
        .on("data", async function (event) {

          const { txOrigin } = event?.meta;
          // const formattedValue = Number(ethers.utils.formatUnits(value, 18));
          if (compareString(txOrigin, account)) {

            const accInfo = await connex.thor.account(account).get();

            let balanceVET = 0;
            let balanceVTHO = 0;

            if (accInfo && accInfo.balance && accInfo.energy) {
              balanceVET = ethers.utils.formatEther(accInfo.balance);
              balanceVET = Math.round(balanceVET * 100) / 100;

              balanceVTHO = ethers.utils.formatEther(accInfo.energy);
              balanceVTHO = Math.round(balanceVTHO * 100) / 100;

              dispatch({
                type: web3Constants.INIT_CONTRACT_VET,
                accInfo,
                balanceVET,
                balanceVTHO,
              });
            }
          }
          // balance = Math.round(balance * 100) / 100;
          // dispatch({
          //   type: web3Constants.ON_VTHO_BALANCE_CHANGED,
          //   payload: balance,
          // });
        })
        .on("changed", (changed) =>
          // When event is attached or removed from the chain
          console.log("🐶🐶  ~ instantiateVBContracts ~ changed", changed)
        )
        .on("error", console.error);
    }

    dispatch({
      type: web3Constants.INIT_CONTRACT_VET,
      accInfo,
      balanceVET,
      balanceVTHO,
    });

    return accInfo;
  }

  dispatch({
    type: web3Constants.INIT_CONTRACT_VET,
    balanceVET: 0,
    balanceVTHO: 0,
  });
};

export const instantiateVBContracts = () => async (dispatch, getState) => {
  const state = getState();
  const { web3, account } = state.web3;

  if (web3 && account) {

    let contractVB = new web3.eth.Contract(
      assetAbi[TOKEN_VEBANK],
      TOKEN_VEBANK
    );

    let balance = 0;

    if (contractVB && account) {
      const balanceBigN = await contractVB.methods.balanceOf(account).call();
      balance = ethers.utils.formatEther(balanceBigN);
      balance = Math.round(balance * 100) / 100;

      contractVB.events
        .allEvents?.()
        .on("data", async (event) => {

          const { txOrigin } = event?.meta;
          if (txOrigin.equals(account)) {
           await contractVB.methods
              .balanceOf(account)
              .call()
              .then((balanceBigNumber) => {
                let balance = ethers.utils.formatUnits(
                  balanceBigNumber,
                  PartialConstants.DEFAULT_ASSET_DECIMAL
                );
                balance = Math.round(balance * 100) / 100;
                dispatch({
                  type: web3Constants.INIT_CONTRACT_VB,
                  contractVB,
                  balance,
                });
            });
            await dispatch(actions.getAccountOverview());
          }

        })
        .on("error", async (err) => {
          console.log("🐶🐶  ~ contractVB.events.Transfer ~ err", err);
        });

    }

    dispatch({
      type: web3Constants.INIT_CONTRACT_VB,
      contractVB,
      balance,
    });

    return balance;
  }

  dispatch({
    type: web3Constants.INIT_CONTRACT_VB,
    contractVB: null,
    balance: 0,
  });
};

export const instantiateNewTokenContracts = (address) => async (dispatch, getState) => {
  const state = getState();
  const { web3, account } = state.web3;

  if (web3 && account) {

    let contractToken = new web3.eth.Contract(
      abiERC20,
      address
    );

    let balance = 0;

    if (contractToken && account) {
      const balanceBigN = await contractToken.methods.balanceOf(account).call();
      balance = ethers.utils.formatEther(balanceBigN);
      balance = Math.round(balance * 100) / 100;

      contractToken.events
        .allEvents?.()
        .on("data", async (event) => {

          const { txOrigin } = event?.meta;
          if (txOrigin.equals(account)) {
           await contractToken.methods
              .balanceOf(account)
              .call()
              .then((balanceBigNumber) => {
                let balance = ethers.utils.formatUnits(
                  balanceBigNumber,
                  PartialConstants.DEFAULT_ASSET_DECIMAL
                );
                balance = Math.round(balance * 100) / 100;
                dispatch({
                  type: web3Constants.INIT_CONTRACT_NEW_TOKEN,
                  contractToken,
                  balance,
                });
            });
            await dispatch(actions.getAccountOverview());
          }

        })
        .on("error", async (err) => {});

    }

    dispatch({
      type: web3Constants.INIT_CONTRACT_NEW_TOKEN,
      contractToken,
      balance,
    });

    return balance;
  }

  dispatch({
    type: web3Constants.INIT_CONTRACT_NEW_TOKEN,
    contractToken: null,
    balance: 0,
  });
};

export const instantiateVEUSDContracts = createAsyncThunk(
  "accountBalance/fetchVEUSD",
  async (_, { getState, dispatch }) => {
    const currentState = getState();
    const { web3, account } = currentState.web3;

    if (web3 && account) {
      let contractVEUSD = new web3.eth.Contract(
        assetAbi[TOKEN_VEUSD],
        TOKEN_VEUSD
      );

      let balance = 0;

      if (contractVEUSD && account) {
        const balanceBigN = await contractVEUSD.methods
          .balanceOf(account)
          .call();
         
        balance = ethers.utils.formatUnits(
          balanceBigN,
          PartialConstants.VEUSD_DECIMAL
        );

        balance = Math.round(balance * 100) / 100;

        
        contractVEUSD.events
          .Transfer()
          .on("data", async function (event) {
            const { txOrigin } = event?.meta;
            if (account.equals(txOrigin)) {

              contractVEUSD.methods
                .balanceOf(account)
                .call()
                .then((balanceBigNumber) => {
                  let balance = ethers.utils.formatUnits(
                    balanceBigNumber,
                    PartialConstants.VEUSD_DECIMAL
                  );
                  balance = Math.round(balance * 100) / 100;
                  dispatch(
                    instantiateVEUSDContracts.fulfilled({
                      balance,
                      contractVEUSD,
                    })
                  );
                });
            }
            
          })
          .on("changed", (changed) =>
            // When event is attached or removed from the chain
            console.log("🐶🐶  ~ instantiateVEUSDContracts ~ changed", changed)
          )
          .on("error", console.error);
      }
      return { balance, contractVEUSD };
    }
  }
);
