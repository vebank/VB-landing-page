import { marketplaceConstants } from '../constants';

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  data: []
}

export function assetsPriceReducer(state = initialState, payload) {

  switch (payload.type) {

    case marketplaceConstants.FETCH_ASSETS_PRICE_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };

    case marketplaceConstants.FETCH_ASSETS_PRICE_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        data: payload.data
      };

    case marketplaceConstants.FETCH_ASSETS_PRICE_ERROR:
      return {
        ...state,
        requesting: false,
        message: payload.message
      };

    default:
      return state;
  }
}

export const selectAssetPrice = state => state.assetsPriceReducer.data
export const selectPriceByTokenAddress = (state, tokenAddress) => state.assetsPriceReducer.data[tokenAddress]