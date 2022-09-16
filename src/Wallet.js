import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import * as actions from "./actions";
import { swapConstants } from "./constants";
import { deserializeToken } from "./hooks/TokensHook";

const Wallet = () => {
  const { account } = useSelector((state) => state.web3, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.on("accountsChanged", accountChangeHandler);
      window.ethereum.on("chainChanged", chainChangeHandler);
    }

    fetchWeb3Init(false);
  }, []);

  useEffect(() => {
    if (account) {
      fetchAccountInit();
    }
  }, [account]);

  async function fetchWeb3Init(loadDefault) {
    await dispatch(actions.web3Connect(loadDefault)); // true is account conected reload contract
    await dispatch(actions.getCurrentAssets());
  }

  async function fetchAccountInit() {
    setTimeout(async () => {
      await dispatch(actions.instantiateVBContracts());
      await dispatch(actions.instantiateVetContracts());
      await dispatch(actions.instantiateVEUSDContracts());
      const tokensAdded = JSON.parse(localStorage.getItem(swapConstants.TOKENS_KEY)) || {};
      const useUserAddedTokens = Object.values(tokensAdded ?? {}).map(
        deserializeToken
      );
      if (useUserAddedTokens) {
        useUserAddedTokens.map((item) => {
          return dispatch(actions.instantiateNewTokenContracts(item.address));
        });
      }
    }, 1000);
  }

  // async function loadAddNetwork() {
  //     await dispatch(actions.changeNetwork());
  // }

  async function accountChangeHandler(accounts) {
    if (accounts.length > 0) {
      if (account === null) {
        fetchWeb3Init(false);
      }

      if (accounts[0] !== account && account) {
        fetchAccountInit();
      }
    } else {
      await dispatch(actions.web3Disconnect());
    }
  }

  const chainChangeHandler = () => {
    window.location.reload();
  };

  return <> </>;
};
export default Wallet;
