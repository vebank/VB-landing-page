import JSBI from "jsbi";

export const FACTORY_ADDRESS = process.env.REACT_APP_ADDRESS_FACTORY;

export const INIT_CODE_HASH =
  "0xb27a1a3920ee6cf6e55a1a70e5804f43e73707102a9240cb840cb5e63c6344fa";

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);

// exports for internal consumption
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TWO = JSBI.BigInt(2);
export const THREE = JSBI.BigInt(3);
export const FIVE = JSBI.BigInt(5);
export const TEN = JSBI.BigInt(10);
export const _100 = JSBI.BigInt(100);
export const _1000 = JSBI.BigInt(1000);

export const TradeType = {
  EXACT_INPUT: "EXACT_INPUT",
  EXACT_OUTPUT: "EXACT_OUTPUT",
};

export const ChainId = {
  MAINNET: 1,
  TESTNET: 3,
};

export const Rounding = {
  ROUND_DOWN: "ROUND_DOWN",
  ROUND_HALF_UP: "ROUND_HALF_UP",
  ROUND_UP: "ROUND_UP",
};

export const SolidityType = {
  uint8: "uint8",
  uint256: "uint256",
};

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt("0xff"),
  [SolidityType.uint256]: JSBI.BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  ),
};

export const swapConstants = {
  FIRST_TOKEN: "FIRST_TOKEN",
  SECOND_TOKEN: "SECOND_TOKEN",
  swapToken: "swapToken",
  checkAssetExistsPools: "checkAssetExistsPools",
  checkExchangeRatePool: "checkExchangeRatePool",
  checkTotalSupplyAvailable: "checkTotalSupplyAvailable",
  getPairsFee: "getPairsFee",
  getAmountsOut: "getAmountsOut",
  getAmountsIn: "getAmountsIn",
  checkApproveToken: "checkApproveToken",
  onApproveTokenForAccount: "onApproveTokenForAccount",
  updateBalanceAccount: "updateBalanceAccount",
  getRoutingPath: "getRoutingPath",
  getMaxAmountOut: "getMaxAmountOut",
  getMinAmountIn: "getMinAmountIn",
  SWAP_EXACT_VET_FOR_TOKENS: "swapExactVETForTokens",
  SWAP_EXACT_TOKENS_FOR_VET: "swapExactTokensForVET",
  SWAP_EXACT_TOKENS_FOR_TOKENS: "swapExactTokensForTokens",
  TOKENS_KEY: "tokens",
};
