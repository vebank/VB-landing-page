import { ethers, FixedNumber } from "ethers";
import queryString from "query-string";

import { poolConstants } from "../constants";

import ERC20ABI_PAIR from "../_contracts/pool/VeBankV1Pair.json";
import ERC20ABI_FACTORY from "../_contracts/pool/VeBankV1Factory.json";

import { compareString, getDecimalForAsset, truncate } from "../utils/lib";
import PartialConstants from "../constants/partial.constants";
import * as actions from "./index";

import { formatUriSecure } from "../utils/lib";

const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;
const pageSize = 10;

// ------------------------ POOL ------------------------ //

export const listenEventPairs = (pairs) => async (dispatch, getState) => {
  const state = getState();
  const { web3, account } = state.web3;

  if (web3 && pairs.length > 0) {
    for await (const item of pairs) {
      const {
        addressTokenA,
        addressTokenB,
        assetsPoolAddress,
        isSubscribeListener,
        pairTransferEvent,
        pairApproveEvent,
      } = item;

      if (assetsPoolAddress) {
        const contractPair = new web3.eth.Contract(
          ERC20ABI_PAIR,
          assetsPoolAddress
        );

        let _isSubscribed = isSubscribeListener ?? false;
        let _pairApproveEvent = pairApproveEvent,
          _pairTransferEvent = pairTransferEvent;

        if (contractPair && !_isSubscribed) {
          _pairTransferEvent = contractPair.events.Transfer?.();
          _pairTransferEvent.on("data", async (data) => {
            // When this pair have a Transfer event from anyone, it will be process in this closure
            const { from, to, value } = data.returnValues;
            if (from.equals(account) || to.equals(account)) {
              // This Transfer event is caused by user. If it's from user,
              // the user is removing the pool, if it's to, user is adding the pool

              dispatch(
                actions.updateLoadingLiquidPoolState({
                  isLoading: true,
                })
              );
              dispatch(getPoolAssetsByAccount(pairs));
              setTimeout(async () => {
                await dispatch(getPoolAssetsByAccount(pairs));
                dispatch(
                  actions.updateLoadingLiquidPoolState({
                    isLoading: false,
                  })
                );
              }, 10000);
            }
          });
          _isSubscribed = true;
        }
      }
    }
  }
};

function getPairVolumeAndFees(dataList) {
  let fees = 0;
  let volumes = 0;
  dataList.map((item) => {
    // FixedNumber.from(fees)
    // .addUnsafe(FixedNumber.from(secondPerFirstTokenExchangeRate.toString()))
    // .toString(),

    //fees = FixedNumber.from(fees).addUnsafe(FixedNumber.from(item.fee_usd)).toString();
    // fees = FixedNumber.from(fees).addUnsafe( FixedNumber.from(item.fee_usd) );
    // volumes =  FixedNumber.from(volumes).addUnsafe( FixedNumber.from(item.volume_usd)  );

    fees = fees + Number(item.fee_usd);
    volumes = volumes + Number(item.volume_usd);


  });
  return { fees, volumes };
}

function getPoolAPR(fee, liquidity) {
  return (fee / (24 * 3600) / liquidity) * 365 * 24 * 3600;
}

export const fetchPairs = (query) => async (dispatch, getState) => {

  const state = getState();
  const { assetEntities } = state.assetsMarketReducer;

  let querySearch = {
    page: 1,
    page_size: pageSize,
  };

  if (query) {
    querySearch = { ...querySearch, ...query };
  }

  const linkQuery = queryString.stringify(querySearch);
  const url = `${process.env.REACT_APP_API_ENDPOINT}${formatUriSecure(
    "/v1/pool/exchange"
  )}&${linkQuery}`;

  try {
    const response = await fetch(url);
    const responseBody = await response.json();

    if (responseBody && responseBody.data) {
      const { pairs, total } = responseBody.data;

      const dataList = pairs.map((e) => {
        const { fees, volumes } = getPairVolumeAndFees(e.hour_data);

        return {
          ...e,
          iconOrigin: assetEntities[e.token0.address?.toLowerCase()]?.icon,
          iconAssets: assetEntities[e.token1.address?.toLowerCase()]?.icon,
          assetsPoolName: e.token0.symbol + " - " + e.token1.symbol,
          assetsSymbolA: e.token0.symbol,
          addressTokenA: e.token0.address,
          assetsSymbolB: e.token1.symbol,
          addressTokenB: e.token1.address,
          assetsPoolAddress: e.pair_address,
          assetsDecimals: e.token0.decimals,
          balanceAccount: 0,
          liquidity: 0,
          liquidity_usd: e.reserve_usd,
          yourLiquidityUSD: 0,
          percentYour: 0,
          volume: volumes,
          fees: fees,
          apr: getPoolAPR(fees, e.reserve_usd),
        };
      });

      dispatch({
        type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
        data: dataList || [],
        total,
      });

      dispatch(getPoolAssetsByAccount(dataList));
      dispatch(listenEventPairs(dataList));
    }
  } catch (error) {
    dispatch({
      type: poolConstants.FETCH_POOL_ASSETS_ERROR,
      message: error,
    });
  }
};

export const getPoolAssetsByAccount =
  (dataAssetPool) => async (dispatch, getState) => {
    const state = getState();

    const { web3, account } = state.web3;

    let dataList = [];
    if (account && ADDRESS_FACTORY && dataAssetPool.length > 0) {
      for await (const item of dataAssetPool) {
        const { addressTokenA, addressTokenB, assetsPoolAddress } = item;

        
        if (item.assetsPoolAddress && account) {
          const contractPair = new web3.eth.Contract(
            ERC20ABI_PAIR,
            item.assetsPoolAddress
          );

          const { amountTokenA, amountTokenB, liquidityPool, totalSupply } =
            await getUserTokenAmounts({
              contractPair,
              account,
              addressTokenA,
              addressTokenB,
            });

          let percentYour = 0;
          if (liquidityPool) {
            percentYour = FixedNumber.from(liquidityPool)
              .divUnsafe(FixedNumber.from(totalSupply))
              .mulUnsafe(FixedNumber.from(100))
              .toString();
          }

          let yourLiquidityUSD = 0;
          if (Number(percentYour) > 0 && item.liquidity_usd) {
            yourLiquidityUSD = FixedNumber.from( truncate(item.liquidity_usd,18).toString())
              .mulUnsafe(FixedNumber.from(percentYour))
              .divUnsafe(FixedNumber.from(100))
              .toString();
          }

          dataList.push({
            ...item,
            balanceAccount: liquidityPool,
            liquidity: totalSupply,
            yourLiquidityUSD,
            percentYour,
            amountTokenA,
            amountTokenB,
          });

          dispatch(
            actions.updateUserAssets({
              assetsPoolAddress,
              liquidityPool,
              amountTokenA,
              amountTokenB,
            })
          );
        }
      }

      dispatch({
        type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
        data: dataList,
      });
    }

    return dataList;
  };

/**
 * This function will mainly calculate the amount of user tokens in pool
 * @param contractPair the Contract of the pair which is need to be calculated
 * @param account the account address of the user.
 * @param addressTokenA the address of the first token of the pair.
 * @param addressTokenB the address of the second token of the pair.
 * @returns the value of all data that needs for liquidity operation
 */
export const getUserTokenAmounts = async ({
  contractPair,
  account,
  addressTokenA,
  addressTokenB,
}) => {
  if (!contractPair) throw new Error("contractPair is missing");
  else if (!account) throw new Error("account is missing");
  else if (!addressTokenA) throw new Error("addressTokenA is missing");
  else if (!addressTokenB) throw new Error("addressTokenB is missing");

  let amountTokenA = 0;
  let amountTokenB = 0;
  let liquidityPool = 0;
  let totalSupply = 0;
  let reserve1 = 0;
  let reserve2 = 0;
  try {

    const balanceBigN = await contractPair.methods.balanceOf(account).call();


    if (Number(balanceBigN) === 0) {
      return {
        amountTokenA,
        amountTokenB,
        liquidityPool,
        totalSupply,
        reserve1,
        reserve2,
      };
    }

    liquidityPool = await ethers.utils.formatUnits(
      balanceBigN,
      PartialConstants.DEFAULT_ASSET_DECIMAL
    );
    
    liquidityPool = FixedNumber.from(liquidityPool);
    totalSupply = await contractPair.methods.totalSupply().call();

    if (totalSupply) {
      totalSupply = ethers.utils.formatUnits(
        totalSupply,
        PartialConstants.DEFAULT_ASSET_DECIMAL
      );
      totalSupply = FixedNumber.from(totalSupply);
    }

    let { 0: _reserve0, 1: _reserve1 } = await contractPair.methods
      ?.getReserves()
      .call();
      
    // Check if token position is match or not, swap reserve position if it's not match.
    const firstTokenAddress = await contractPair.methods.token0().call();
    if (
      firstTokenAddress.toLocaleUpperCase() !==
      addressTokenA.toLocaleUpperCase()
    ) {
      [_reserve0, _reserve1] = [_reserve1, _reserve0];
    }

    _reserve0 = ethers.utils.formatUnits(
      _reserve0,
      getDecimalForAsset(addressTokenA)
    );
    _reserve0 = FixedNumber.from(_reserve0);

    _reserve1 = ethers.utils.formatUnits(
      _reserve1,
      getDecimalForAsset(addressTokenB)
    );
    _reserve1 = FixedNumber.from(_reserve1);

    // Using calculation like this to avoid auto rounding numbers of JS
    if (liquidityPool >= 0 && totalSupply > 0) {
      amountTokenA = liquidityPool.mulUnsafe(_reserve0).divUnsafe(totalSupply);
      amountTokenB = liquidityPool.mulUnsafe(_reserve1).divUnsafe(totalSupply);
    }
    [reserve1, reserve2] = [_reserve0, _reserve1];
    amountTokenA = amountTokenA.toString();
    amountTokenB = amountTokenB.toString();
    liquidityPool = liquidityPool.toString();
    totalSupply = totalSupply.toString();
    reserve1 = reserve1.toString();
    reserve2 = reserve2.toString();
  } catch (error) {
    console.error(error);
  }
  return {
    amountTokenA,
    amountTokenB,
    liquidityPool,
    totalSupply,
    reserve1,
    reserve2,
  };
};

export const closeAddLiquidity = () => {
  return {
    type: poolConstants.MODAL_CLOSE_ADD_LIQUIDITY,
  };
};

export const closeRemoveLiquidity = () => {
  return {
    type: poolConstants.MODAL_CLOSE_REMOVE_LIQUIDITY,
  };
};

export const liquidityPoolApproved = (assetsPoolAddress, approveAmount) => ({
  type: poolConstants.APPROVE_LP_TOKEN,
  payload: { assetsPoolAddress, approveAmount },
});
