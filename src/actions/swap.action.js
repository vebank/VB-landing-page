import { swapConstants, web3Constants } from "../constants";
import * as actions from "../actions";
import { instantiateVEUSDContracts } from "../actions";
import { ethers, FixedNumber } from "ethers";
import queryString from "query-string";

import ERC20ABI_FACTORY from "../_contracts/pool/VeBankV1Factory.json";
import ERC20ABI_ROUTER from "../_contracts/pool/VeBankV1Router02.json";
import ERC20ABI_PAIR from "../_contracts/pool/VeBankV1Pair.json";

import ERC20ABI_VB from "../_contracts/assets/VB.json";

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addressWalletCompact,
  compareString,
  formatInputDecimal,
  formatUriSecure,
  getDeadline,
  getDecimalForAsset,
  isContainVET,
  nFormatter,
  randomKeyUUID,
} from "../utils/lib";

import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";
import { getSymbolPairs, setLoadingSwap } from "../reducers/swap.reducer";
import PartialConstants from "../constants/partial.constants";
import assetAbi from "../_contracts/asset-abi";

const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

const TOKEN_VTHO = process.env.REACT_APP_TOKEN_VTHO;
const TOKEN_VET = process.env.REACT_APP_TOKEN_WVET;
const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_VEUSD = process.env.REACT_APP_TOKEN_VEUSD;

// ------------------------ SWAP ------------------------ //

export { swapTokenDesire } from "../reducers/swap.reducer";

export const checkAssetExistsPools = createAsyncThunk(
  swapConstants.checkAssetExistsPools,
  async ({ tokenAInfo, tokenBInfo }, { dispatch, getState }) => {
    const state = getState();

    const addressTokenA = tokenAInfo?.assetsAddress || "";
    const addressTokenB = tokenBInfo?.assetsAddress || "";

    const { web3 } = state.web3;
    if (web3 && ADDRESS_FACTORY) {
      let contractFactory = new web3.eth.Contract(
        ERC20ABI_FACTORY,
        ADDRESS_FACTORY
      );
      //"getPair(address tokenA, address tokenB),
      const assetsPoolAddress = await contractFactory.methods
        .getPair(addressTokenA, addressTokenB)
        .call();

      const emptyAddress = /^0x0+$/.test(assetsPoolAddress); // true == not exist pool

      return {
        assetsPoolAddress: assetsPoolAddress,
        emptyAddress: emptyAddress,
      };
    }
  }
);

export const checkExchangeRatePool = createAsyncThunk(
  swapConstants.checkExchangeRatePool,
  async (
    { tokenAddressA, tokenAddressB, assetsPoolAddress },
    { dispatch, getState }
  ) => {
    const state = getState();
    const { web3 } = state.web3;
    if (web3 && ADDRESS_FACTORY) {
      const contractPair = new web3.eth.Contract(
        ERC20ABI_PAIR,
        assetsPoolAddress
      );
      const reserves = await contractPair.methods.getReserves().call();
      const addressToken1 = await contractPair.methods.token0().call();
      const addressToken2 = await contractPair.methods.token1().call();
      const reserves1 = ethers.utils.formatUnits(
        compareString(addressToken1, tokenAddressA)
          ? reserves?.[0]
          : reserves?.[1],
        getDecimalForAsset(tokenAddressA)
      );
      const reserves2 = ethers.utils.formatUnits(
        compareString(addressToken2, tokenAddressB)
          ? reserves?.[1]
          : reserves?.[0],
        getDecimalForAsset(tokenAddressB)
      );

      return {
        reserves1,
        reserves2,
      };
    }
  }
);

export const checkTotalSupplyAvailable = createAsyncThunk(
  swapConstants.checkTotalSupplyAvailable,
  async ({ amountOut }, { dispatch, getState }) => {
    const state = getState();
    const { web3 } = state.web3;
    const { reserves2, poolAddress, sourceTokenAddress, desireTokenAddress } =
      state.swapAsset;

    if (web3 && ADDRESS_FACTORY) {
      let assetsDecimals = 18;
      if (
        sourceTokenAddress === process.env.REACT_APP_TOKEN_VEUSD ||
        desireTokenAddress === process.env.REACT_APP_TOKEN_VEUSD
      ) {
        assetsDecimals = 12;
      }
      const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, poolAddress);

      let totalSupply = await contractPair.methods.totalSupply().call();
      if (totalSupply) {
        totalSupply = ethers.utils.formatUnits(totalSupply, assetsDecimals);
        if (totalSupply < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
          totalSupply = nFormatter(totalSupply);
        }
      }

      if (
        parseFloat(amountOut) > parseFloat(reserves2) ||
        parseFloat(totalSupply) <= 0.0
      ) {
        return {
          totalSupply: totalSupply,
          isVolumeAvailable: false,
        };
      } else {
        return { totalSupply: totalSupply, isVolumeAvailable: true };
      }
    }
  }
);

export const getPairsFee = createAsyncThunk(
  swapConstants.getPairsFee,
  async ({ tokenAInfo, tokenBInfo }, { dispatch, getState }) => {
    return 3;
  }
);

export const getAmountsOut = createAsyncThunk(
  swapConstants.getAmountsOut,
  async ({ inputAmountIn, tokenAInfo, tokenBInfo }, { dispatch, getState }) => {
    const state = getState();

    const addressTokenB = tokenBInfo?.assetsAddress || "";

    const { reserves1, reserves2, pairFee } = state.swapAsset;

    const temp2 = FixedNumber.from(pairFee)
      .divUnsafe(FixedNumber.from(1000))
      .toString();
    const temp3 = FixedNumber.from(1)
      .subUnsafe(FixedNumber.from(temp2))
      .toString();

    const tempUp1 = FixedNumber.from(reserves2)
      .mulUnsafe(FixedNumber.from(inputAmountIn.toString()))
      .toString();

    const up = FixedNumber.from(tempUp1)
      .mulUnsafe(FixedNumber.from(temp3))
      .toString();

    const tempDown1 = FixedNumber.from(reserves1)
      .addUnsafe(FixedNumber.from(inputAmountIn.toString()))
      .toString();

    const down = FixedNumber.from(tempDown1)
      .mulUnsafe(FixedNumber.from(temp3))
      .toString();

    const amountOut = FixedNumber.from(up)
      .divUnsafe(FixedNumber.from(down))
      .toString();

    const amountsOutFormat = formatInputDecimal(amountOut, addressTokenB);

    return { inputAmountIn, amountsOutFormat };
  }
);

export const getAmountsIn = createAsyncThunk(
  swapConstants.getAmountsIn,
  async (
    { inputAmountOut, tokenAInfo, tokenBInfo },
    { dispatch, getState }
  ) => {
    const state = getState();

    const addressTokenA = tokenAInfo?.assetsAddress || "";

    const { reserves1, reserves2, pairFee } = state.swapAsset;

    const up = FixedNumber.from(reserves1)
      .mulUnsafe(FixedNumber.from(inputAmountOut.toString()))
      .toString();

    const tempDown1 = FixedNumber.from(reserves2)
      .subUnsafe(FixedNumber.from(inputAmountOut.toString()))
      .toString();
    const tempDown2 = FixedNumber.from(pairFee)
      .divUnsafe(FixedNumber.from(1000))
      .toString();
    const tempDown3 = FixedNumber.from(1)
      .subUnsafe(FixedNumber.from(tempDown2))
      .toString();

    const down = FixedNumber.from(tempDown1)
      .mulUnsafe(FixedNumber.from(tempDown3))
      .toString();

    const amountIn = FixedNumber.from(up)
      .divUnsafe(FixedNumber.from(down))
      .toString();

    const amountsInFormat = formatInputDecimal(amountIn, addressTokenA);

    return { amountsInFormat, inputAmountOut };
  }
);

export const checkApproveToken = createAsyncThunk(
  swapConstants.checkApproveToken,
  async ({ tokenInfo }, { dispatch, getState }) => {
    const state = getState();
    const { web3, account } = state.web3;
    let accountApprove = 0;
    let contractSwap;

    const addressToken = tokenInfo?.assetsAddress || "";

    contractSwap = new web3.eth.Contract(ERC20ABI_VB, addressToken);

    // get the approved coin MSP account
    accountApprove = await contractSwap.methods
      .allowance(account, ADDRESS_ROUTER)
      .call();
    accountApprove = ethers.utils.formatEther(accountApprove);
    accountApprove = Number(accountApprove);

    return { contractSwap: contractSwap, accountApprove: accountApprove };
  }
);

export const onApproveTokenForAccount = createAsyncThunk(
  swapConstants.onApproveTokenForAccount,
  async ({ tokenInfo }, { dispatch, getState }) => {
    const state = getState();
    const { web3, account, connex } = state.web3;
    const { contractSwap } = state.swapAsset;
    let amountMax = 1000000000;

    const addressToken = tokenInfo?.assetsAddress || "";

    if (account && contractSwap && addressToken) {
      const key = randomKeyUUID();
      const approveABI = {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      };
      const approveMethod = connex.thor
        .account(addressToken)
        .method(approveABI);

      try {
        const res = await approveMethod
          .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
          .comment(`Approve ${tokenInfo.assetsSymbol} on VeBank`)
          .accepted(() => {
            dispatch(
              actions.alertActions.loading(
                {
                  title: "Waiting For Approve",
                  description: `Approve ${tokenInfo.assetsSymbol} on VeBank`,
                },
                key
              )
            );
            return amountMax;
          })
          .request();

        if (res) {
          amountMax = 1000000000;
          dispatch(
            actions.alertActions.update(
              {
                status: "success",
                title: "Approve successfully",
                description: `Approve ${tokenInfo.assetsSymbol} successfully`,
              },
              key
            )
          );
          return { accountApprove: amountMax };
        }
      } catch (error) {
        amountMax = 0;
        dispatch(
          actions.alertActions.update(
            {
              status: "warning",
              title: "Approve failed",
              description: `Approve ${tokenInfo.assetsSymbol} failed`,
            },
            key
          )
        );
        return { accountApprove: amountMax };
      }
    }
  }
);

export const swapAsset = createAsyncThunk(
  swapConstants.swapToken,
  async (
    { amountInToSwap, amountsOut, minAmountOut, path, tokenAInfo, tokenBInfo },
    { dispatch, getState }
  ) => {
    const currentState = getState();
    const { connex, account, web3 } = currentState.web3;
    const assetsPoolName = `${tokenAInfo?.assetsSymbol} - ${tokenBInfo?.assetsSymbol}`;
    const key = randomKeyUUID();

    const addressTokenA = tokenAInfo?.assetsAddress || "";
    const addressTokenB = tokenBInfo?.assetsAddress || "";

    const isPairContainVET = isContainVET(addressTokenA, addressTokenB);

    const amountOutMin = web3.utils.toWei(
      formatInputDecimal(minAmountOut, addressTokenB),
      getDecimalForAsset(addressTokenB) === PartialConstants.VEUSD_DECIMAL
        ? "mwei"
        : "ether"
    );
    const deadline = getDeadline();
    const amountIn = web3.utils.toWei(
      formatInputDecimal(amountInToSwap, addressTokenA),
      getDecimalForAsset(addressTokenA) === PartialConstants.VEUSD_DECIMAL
        ? "mwei"
        : "ether"
    );

    let functionName = "";
    if (addressTokenA === process.env.REACT_APP_TOKEN_WVET) {
      // Swapping VET to another token
      functionName = swapConstants.SWAP_EXACT_VET_FOR_TOKENS;
    } else if (addressTokenB === process.env.REACT_APP_TOKEN_WVET) {
      // Swapping another token to VET token
      functionName = swapConstants.SWAP_EXACT_TOKENS_FOR_VET;
    } else {
      // Swapping token to token
      functionName = swapConstants.SWAP_EXACT_TOKENS_FOR_TOKENS;
    }

    const swapABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === functionName && type === "function"
    );

    const methodSwapToken = connex.thor.account(ADDRESS_ROUTER).method(swapABI);

    let transaction;
    if (isPairContainVET) {
      if (functionName === swapConstants.SWAP_EXACT_VET_FOR_TOKENS) {
        // swap VET to another tokens
        console.table([
          ["method", functionName],
          ["path", path],
          ["amountOutMin", amountOutMin],
          ["addressTokenA", addressTokenA],
          ["addressTokenB", addressTokenB],
        ]);

        methodSwapToken.value(amountIn);
        transaction = await methodSwapToken
          .transact(amountOutMin, path, account, deadline)
          .comment(`transaction swap ${assetsPoolName} from VeBank`)
          .accepted(() => {
            dispatch(setLoadingSwap(true));
            dispatch(
              actions.alertActions.loading(
                {
                  title: "Waiting For Confirmation",
                  description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
                },
                key
              )
            );
            return transaction;
          })
          .request()
          .then((transaction) => {
            dispatch(
              actions.alertActions.update(
                {
                  status: "success",
                  title: "Transaction Submitted",
                  description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
                  details: {
                    message: "View on VeChain Stats",
                    txid: transaction.txid,
                  },
                },
                key
              )
            );
            return transaction;
          })
          .catch((e) => {
            dispatch(
              actions.alertActions.update(
                {
                  status: "warning",
                  title: "Transaction Rejected",
                  description: `Wallet ${addressWalletCompact(account)}`,
                },
                key
              )
            );
          });
      } else {
        //swap another token to VET token
        console.table([
          ["method", functionName],
          ["path", path],
          ["amountIn", amountIn],
          ["amountOutMin", amountOutMin],
          ["addressTokenA", addressTokenA],
          ["addressTokenB", addressTokenB],
        ]);
        transaction = await methodSwapToken
          .transact(amountIn, amountOutMin, path, account, deadline)
          .comment(`transaction swap ${assetsPoolName} from VeBank`)
          .accepted(() => {
            dispatch(setLoadingSwap(true));
            dispatch(
              actions.alertActions.loading(
                {
                  title: "Waiting For Confirmation",
                  description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
                },
                key
              )
            );
            return transaction;
          })
          .request()
          .then((transaction) => {
            dispatch(
              actions.alertActions.update(
                {
                  status: "success",
                  title: "Transaction Submitted",
                  description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
                  details: {
                    message: "View on VeChain Stats",
                    txid: transaction.txid,
                  },
                },
                key
              )
            );
            return transaction;
          })
          .catch((e) => {
            dispatch(
              actions.alertActions.update(
                {
                  status: "warning",
                  title: "Transaction Rejected",
                  description: `Wallet ${addressWalletCompact(account)}`,
                },
                key
              )
            );
          });
      }
    } else {
      console.table([
        ["method", functionName],
        ["path", path],
        ["amountIn", amountIn],
        ["amountOutMin", amountOutMin],
        ["addressTokenA", addressTokenA],
        ["addressTokenB", addressTokenB],
      ]);
      // swap token to token
      transaction = await methodSwapToken
        .transact(amountIn, amountOutMin, path, account, deadline)
        .comment(`transaction swap ${assetsPoolName} from VeBank`)
        .accepted(() => {
          dispatch(setLoadingSwap(true));
          dispatch(
            actions.alertActions.loading(
              {
                title: "Waiting For Confirmation",
                description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
              },
              key
            )
          );
          return transaction;
        })
        .request()
        .then((transaction) => {
          dispatch(
            actions.alertActions.update(
              {
                status: "success",
                title: "Transaction Submitted",
                description: `Swapping ${amountInToSwap} ${tokenAInfo.assetsSymbol} for ${amountsOut} ${tokenBInfo.assetsSymbol}`,
                details: {
                  message: "View on VeChain Stats",
                  txid: transaction.txid,
                },
              },
              key
            )
          );
          return transaction;
        })
        .catch((e) => {
          dispatch(
            actions.alertActions.update(
              {
                status: "warning",
                title: "Transaction Rejected",
                description: `Wallet ${addressWalletCompact(account)}`,
              },
              key
            )
          );
          return null;
        });
    }
    return transaction;
  }
);

export const updateBalanceAccount = createAsyncThunk(
  swapConstants.updateBalanceAccount,
  async ({ addressTokenA, addressTokenB }, { dispatch, getState }) => {
    const state = getState();
    const { connex, web3, account } = state.web3;

    let balanceVET = 0;
    let balanceVTHO = 0;

    if (web3 && account) {
      const contractVET = new web3.eth.Contract(assetAbi[TOKEN_VET], TOKEN_VET);

      const contractVTHO = new web3.eth.Contract(
        assetAbi[TOKEN_VTHO],
        TOKEN_VTHO
      );

      let contractVEUSD = new web3.eth.Contract(
        assetAbi[TOKEN_VEUSD],
        TOKEN_VEUSD
      );

      let contractVB = new web3.eth.Contract(
        assetAbi[TOKEN_VEBANK],
        TOKEN_VEBANK
      );

      if (
        compareString(addressTokenA, TOKEN_VET) ||
        compareString(addressTokenB, TOKEN_VET)
      ) {
        contractVET.events.Transfer({}).on("data", async (data) => {
          const accInfo = await connex.thor.account(account).get();
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
        });
      }
      if (
        compareString(addressTokenA, TOKEN_VTHO) ||
        compareString(addressTokenB, TOKEN_VTHO)
      ) {
        contractVTHO.events.Transfer({}).on("data", async (data) => {
          const accInfo = await connex.thor.account(account).get();
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
        });
      }
      if (
        compareString(addressTokenA, TOKEN_VEUSD) ||
        compareString(addressTokenB, TOKEN_VEUSD)
      ) {
        contractVEUSD.events.Transfer({}).on("data", async (data) => {
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
        });
      }

      if (
        compareString(addressTokenA, TOKEN_VEBANK) ||
        compareString(addressTokenB, TOKEN_VEBANK)
      ) {
        contractVB.events.Transfer({}).on("data", async (data) => {
          contractVB.methods
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
        });
      }
    }
  }
);

export const getRoutingPath = createAsyncThunk(
  swapConstants.getRoutingPath,
  async (data, { dispatch, getState }) => {
    let query = {
      page: 1,
      page_size: 10,
    };

    if (data) {
      query = { ...query, ...data };
    }

    const linkQuery = queryString.stringify(query);
    const url = `${process.env.REACT_APP_API_ENDPOINT}${formatUriSecure(
      "/v1/pool/routing_path"
    )}&${linkQuery}`;
    try {
      const response = await fetch(url);
      const responseBody = await response.json();
      if (responseBody && responseBody.data) {
        return responseBody.data;
      }
    } catch (error) {
      return [];
    }
  }
);

export const getMaxAmountOut = createAsyncThunk(
  swapConstants.getMaxAmountOut,
  async ({ paths, amountIn, addressTokenA, addressTokenB }, { getState }) => {
    const state = getState();
    let _path = [];
    let maxAmount = null;
    let amountOutMaxFormat = "";

    const { web3 } = state.web3;
    if (web3 && ADDRESS_ROUTER) {
      let contractRouter = new web3.eth.Contract(
        ERC20ABI_ROUTER,
        ADDRESS_ROUTER
      );

      const amountInUint = web3.utils.toWei(
        amountIn.toString(),
        getDecimalForAsset(addressTokenA) === PartialConstants.VEUSD_DECIMAL
          ? "mwei"
          : "ether"
      );

      for await (const path of paths) {
        const amountsOut = await contractRouter.methods
          .getAmountsOut(amountInUint, path)
          .call();
        if (!maxAmount) {
          maxAmount = amountsOut.at(-1);
        }
        if (Number(amountsOut.at(-1)) >= Number(maxAmount)) {
          maxAmount = amountsOut.at(-1);
          _path = path;
        }
      }

      amountOutMaxFormat = ethers.utils.formatUnits(
        maxAmount,
        getDecimalForAsset(addressTokenB)
      );
      return {
        path: _path,
        amountOutMax: formatInputDecimal(amountOutMaxFormat, addressTokenB),
      };
    }
  }
);

export const getMinAmountIn = createAsyncThunk(
  swapConstants.getMinAmountIn,
  async ({ paths, amountOut, addressTokenA, addressTokenB }, { getState }) => {
    const state = getState();
    let _path = [];
    let minAmount = null;
    let amountInMinFormat = "";

    const { web3 } = state.web3;
    if (web3 && ADDRESS_ROUTER) {
      let contractRouter = new web3.eth.Contract(
        ERC20ABI_ROUTER,
        ADDRESS_ROUTER
      );

      const amountOutUint = web3.utils.toWei(
        amountOut.toString(),
        getDecimalForAsset(addressTokenB) === PartialConstants.VEUSD_DECIMAL
          ? "mwei"
          : "ether"
      );

      for await (const path of paths) {
        const amountsIn = await contractRouter.methods
          .getAmountsIn(amountOutUint, path)
          .call();

        if (!minAmount) {
          minAmount = amountsIn[0];
        }

        if (Number(amountsIn[0]) <= Number(minAmount)) {
          minAmount = amountsIn[0];
          _path = path;
        }
      }

      amountInMinFormat = ethers.utils.formatUnits(
        minAmount,
        getDecimalForAsset(addressTokenA)
      );

      return {
        path: _path,
        amountInMin: formatInputDecimal(amountInMinFormat, addressTokenA),
        amountOut: amountOut,
      };
    }
  }
);

export const getAllPairs = () => async (dispatch, getState) => {
  const state = getState();

  const { web3, account } = state.web3;

  let dataSymbolPair = [];

  if (web3 && ADDRESS_FACTORY) {
    const contractFactory = new web3.eth.Contract(
      ERC20ABI_FACTORY,
      ADDRESS_FACTORY
    );
    const allPairsLength = await contractFactory.methods
      .allPairsLength()
      .call();
    for (let index = 0; index < allPairsLength; index++) {
      const poolAddress = await contractFactory.methods.allPairs(index).call();
      let addressTokenA = "";
      let addressTokenB = "";
      if (poolAddress && account) {
        const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, poolAddress);
        addressTokenA = await contractPair.methods.token0().call();
        addressTokenB = await contractPair.methods.token1().call();
        let symbolTokenA = selectAssetByAddress(
          state,
          addressTokenA
        ).assetsSymbol;
        let symbolTokenB = selectAssetByAddress(
          state,
          addressTokenB
        ).assetsSymbol;
        dataSymbolPair.push({
          symbolTokenA: symbolTokenA,
          symbolTokenB: symbolTokenB,
        });
      }
    }
    dispatch(getSymbolPairs(dataSymbolPair));
  }
};
