import { marketplaceConstants, swapConstants } from "../constants";

import IcVeUSD from "../assets/images/ic_veusd.svg";
import IcVeChain from "../assets/images/ic_vechain.svg";
import IcVeBank from "../assets/images/ic_vebank.svg";
import IcVtho from "../assets/images/ic_vtho.svg";

import IcvBTC from "../assets/images/ic_vBTC.svg";
import IcvETH from "../assets/images/ic_vETH.svg";

import { assetToken, deserializeToken } from "../hooks/TokensHook";

const mappingDataToken = () => {
  let newList = [];
  const tokensAdded =
    JSON.parse(localStorage.getItem(swapConstants.TOKENS_KEY)) || {};
  const useUserAddedTokens = Object.values(tokensAdded ?? {}).map(
    deserializeToken
  );
  useUserAddedTokens.map((item) => {
    return newList.push({
      ...assetToken(item),
      isActive: true,
    });
  });
  return newList;
};

function getListKeyAssets(dataList) {
  let newList = mappingDataToken();
  let keys = [];
  for (const i of newList.concat(dataList)) {
    keys[i.assetsAddress.toLowerCase()] = i;
  }
  return keys;
}

function getListAssets(listAsset) {
  let newList = mappingDataToken();
  return newList.concat(listAsset);
}

const listAsset = [
  {
    icon: IcVeChain,
    assetsSymbol: "VET",
    assetName: "VeChain",
    assetsAddress: process.env.REACT_APP_TOKEN_WVET,
    assetsDecimals: 18,
    isLend: true,
    isActive: true,
  },
  {
    icon: IcVeUSD,
    assetsSymbol: "VEUSD",
    assetName: "VeUSD",
    assetsAddress: process.env.REACT_APP_TOKEN_VEUSD,
    assetsDecimals: 6,
    isLend: true,
    isActive: true,
  },
  {
    icon: IcVtho,
    assetsSymbol: "VTHO",
    assetName: "VeThor",
    assetsAddress: process.env.REACT_APP_TOKEN_VTHO,
    assetsDecimals: 18,
    isLend: true,
    isActive: true,
  },
  {
    icon: IcVeBank,
    assetsSymbol: "VB",
    assetName: "VeBank",
    assetsAddress: process.env.REACT_APP_TOKEN_VEBANK,
    assetsDecimals: 18,
    isLend: true,
    isActive: true,
  },
  {
    icon: IcvBTC,
    assetsSymbol: "vBTC",
    assetName: "Wrapped BTC",
    assetsAddress: process.env.REACT_APP_TOKEN_VBTC,
    assetsDecimals: 18,
    isLend: false,
    isActive: false,
  },
  {
    icon: IcvETH,
    assetsSymbol: "vETH",
    assetName: "Wrapped ETH",
    assetsAddress: process.env.REACT_APP_TOKEN_VETH,
    assetsDecimals: 18,
    isLend: false,
    isActive: false,
  },
];

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  totalSupply: 0,
  totalBorrow: 0,
  total: 0,
  addresses: [
    process.env.REACT_APP_TOKEN_WVET,
    process.env.REACT_APP_TOKEN_VEUSD,
    process.env.REACT_APP_TOKEN_VTHO,
    process.env.REACT_APP_TOKEN_VEBANK,
  ],
  listAsset: getListAssets(listAsset),
  assetEntities: getListKeyAssets(listAsset),
  data: [],
};

export function assetsMarketReducer(state = initialState, payload) {
  switch (payload.type) {
    case marketplaceConstants.FETCH_ASSETS_MARKET_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };

    case marketplaceConstants.ADD_ASSET:
      return {
        ...state,
        listAsset: getListAssets(listAsset),
        assetEntities: getListKeyAssets(listAsset),
      };

    case marketplaceConstants.FETCH_ASSETS_MARKET_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        data: payload.data,
        totalSupply: payload.totalSupply,
        totalBorrow: payload.totalBorrow,
        total: payload.total,
      };

    case marketplaceConstants.FETCH_ICENTIVES_MARKET_SUCCESS:
      return {
        ...state,
        data: payload.data,
      };

    case marketplaceConstants.FETCH_ASSETS_MARKET_ERROR:
      return {
        ...state,
        requesting: false,
        message: payload.message,
      };

    default:
      return state;
  }
}

export const selectListAssets = (state) => state.assetsMarketReducer.listAsset;
export const selectAssetByAddress = (state, address) => {
  if (address) {
    return state.assetsMarketReducer.assetEntities[address.toLowerCase()];
  }
  return null;
};
