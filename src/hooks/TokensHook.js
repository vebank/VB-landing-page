import { useCallback, useMemo } from "react";
import { findKey } from "lodash";
import { Token, WVET } from "../blockchain/Token";
import { ChainId, swapConstants } from "../constants/swap.constants";
import { getTokenDecimals, getTokenName, getTokenSymbol } from "../utils/lib";
import Connex from "@vechain/connex";

import IcVETH from "../assets/images/ic_vETH.svg";
import IcVBTC from "../assets/images/ic_vBTC.svg";
import IcVeBank from "../assets/images/ic_vebank.svg";

const TOKEN_VTHO = process.env.REACT_APP_TOKEN_VTHO;
const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_VEUSD = process.env.REACT_APP_TOKEN_VEUSD;
const TOKEN_VETH = process.env.REACT_APP_TOKEN_VETH;
const TOKEN_VBTC = process.env.REACT_APP_TOKEN_VBTC;

export function getLibrary() {
  return new Connex({
    node: process.env.REACT_APP_CHAIN_NETWORK,
    network: process.env.REACT_APP_NAME_NETWORK,
  });
}

const renderIcon = (token) => {
  switch (token.address) {
    case TOKEN_VBTC: {
      return IcVBTC;
    }
    case TOKEN_VETH: {
      return IcVETH;
    }
    default: {
      return IcVeBank;
    }
  }
};

export function assetToken(token) {
  return {
    icon: renderIcon(token),
    chainId: token.chainId,
    assetsSymbol: token.symbol,
    assetName: token.name,
    assetsAddress: token.address,
    assetsDecimals: Number(token.decimals),
  };
}

export function serializeToken(token) {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  };
}

export function deserializeToken(serializedToken) {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  );
}

export function useUserAddedTokens() {
  return useMemo(() => {
    const tokensAdded =
      JSON.parse(localStorage.getItem(swapConstants.TOKENS_KEY)) || {};
    return Object.values(tokensAdded ?? {}).map(deserializeToken);
  }, []);
}

export function useFetchTokenByAddress(address) {
  const chainId = ChainId.TESTNET;
  const library = getLibrary();

  return useCallback(
    async (address) => {
      const [decimals, symbol, name] = await Promise.all([
        getTokenDecimals(address, library).catch(() => null),
        getTokenSymbol(address, library).catch(() => "UNKNOWN"),
        getTokenName(address, library).catch(() => "Unknown"),
      ]);

      if (decimals === null) {
        return null;
      } else {
        return new Token(chainId, address, decimals, symbol, name);
      }
    },
    [library, chainId]
  );
}

const TESTNET_TOKENS = [
  new Token(ChainId.TESTNET, TOKEN_VEUSD, 6, "VEUSD", "VeUSD"),
  new Token(ChainId.TESTNET, TOKEN_VTHO, 18, "VTHO", "VeThor"),
  new Token(ChainId.TESTNET, TOKEN_VEBANK, 18, "VB", "VeBank"),
];

export const ALL_TOKENS = [
  // WVET on all chains
  WVET[ChainId.TESTNET],
  // chain-specific tokens
  ...TESTNET_TOKENS,
]
  // put into an object
  .reduce((tokenMap, token) => {
    if (tokenMap?.[token.chainId]?.[token.address] !== undefined)
      throw Error("Duplicate tokens.");
    return {
      ...tokenMap,
      [token.chainId]: {
        ...tokenMap?.[token.chainId],
        [token.address]: token,
      },
    };
  }, {});

export function useAllTokens() {
  const chainId = ChainId.TESTNET;
  const userAddedTokens = useUserAddedTokens();
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce((tokenMap, token) => {
          tokenMap[token.address] = token;
          return tokenMap;
        }, ALL_TOKENS[chainId] ?? {})
    );
  }, [userAddedTokens, chainId]);
}

export function useToken(tokenAddress) {
  const tokens = useAllTokens();

  return tokens?.[tokenAddress];
}

export function useTokenByAddressAndAutomaticallyAdd(tokenAddress) {
  const allTokens = useAllTokens();
  return useMemo(() => {
    const token = findKey(
      allTokens,
      (token) => token.address?.toLowerCase() === tokenAddress?.toLowerCase()
    );
    return allTokens?.[token];
  }, [allTokens, tokenAddress]);
}
