import { useTokenByAddressAndAutomaticallyAdd } from "./TokensHook";
import { useTradeExactIn, useTradeExactOut } from "./Trades";
import { parseUnits } from "ethers/lib/utils";
import { TokenAmount } from "../blockchain/fractions";
import JSBI from "jsbi";
import { INPUT_TYPE } from "./constants";

function tryParseAmount(value, token) {
  // value: string, token: Token, return TokenAmount
  if (!value || !token) return;
  try {
    const typedValueParsed = parseUnits(value, token.decimals).toString();
    if (typedValueParsed !== "0")
      return new TokenAmount(token, JSBI.BigInt(typedValueParsed));
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
}

export function useSwap(amountInput, type, tokenInAddress, tokenOutAddress) {
  const tokenIn = useTokenByAddressAndAutomaticallyAdd(tokenInAddress);
  const tokenOut = useTokenByAddressAndAutomaticallyAdd(tokenOutAddress);

  const isExactIn = type === INPUT_TYPE.INPUT;
  const amount = tryParseAmount(amountInput, isExactIn ? tokenIn : tokenOut);

  const bestTradeExactIn = useTradeExactIn(amount, tokenOut);
  const bestTradeExactOut = useTradeExactOut(tokenIn, amount);

  const bestTrade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const parsedAmounts = {
    [INPUT_TYPE.INPUT]: isExactIn ? amount : bestTrade?.inputAmount,
    [INPUT_TYPE.OUTPUT]: isExactIn ? bestTrade?.outputAmount : amount,
  };

  const tokens = {
    [INPUT_TYPE.INPUT]: tokenIn,
    [INPUT_TYPE.OUTPUT]: tokenOut,
  };

  let path = bestTrade?.route?.path.map((item) => {
    return item.address;
  });

  return {
    tokens,
    bestTrade,
    path: path,
    parsedAmounts,
    priceImpact: bestTrade?.priceImpact,
  };
}
