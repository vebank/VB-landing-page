import { FixedNumber } from "ethers";
import { useMemo } from "react";
import PartialConstants from "../constants/partial.constants";
import {
  checkLengthDecimal,
  formatInputDecimal,
  formatLocaleString,
  getDecimalForAsset,
  toFixedLargeNumber,
} from "../utils/lib";

export function useSwapFee(fee, amountIn, tokenFrom) {
  return useMemo(
    () => countSwapFee(fee, amountIn, tokenFrom),
    [amountIn, fee, tokenFrom]
  );
}

export function useAmountOutMin(tokenTo, amountOut, slippage) {
  return useMemo(
    () => countAmountOutMin(tokenTo, amountOut, slippage),
    [amountOut, tokenTo, slippage]
  );
}

export function useCheckBalance(tokenFromBalance, amount) {
  return useMemo(
    () => checkBalance(tokenFromBalance, amount),
    [tokenFromBalance, amount]
  );
}

const checkBalance = (tokenFromBalance, amount) => {
  if (parseFloat(amount) > tokenFromBalance) {
    return false;
  } else {
    return true;
  }
};

const countSwapFee = (fee, amountIn, tokenFrom) => {
  if (fee && amountIn && tokenFrom) {
    return getDecimalForAsset(tokenFrom) === PartialConstants.VEUSD_DECIMAL
      ? formatLocaleString(
          getSwapFee(fee, amountIn, tokenFrom),
          PartialConstants.VEUSD_DECIMAL,
          checkLengthDecimal(getSwapFee(fee, amountIn, tokenFrom), tokenFrom)
        )
      : formatLocaleString(
          getSwapFee(fee, amountIn, tokenFrom),
          PartialConstants.DEFAULT_ASSET_DECIMAL,
          checkLengthDecimal(getSwapFee(fee, amountIn, tokenFrom), tokenFrom)
        );
  }
};

const getSwapFee = (fee, amountIn, tokenFrom) => {
  if (fee && amountIn && tokenFrom) {
    const feeDivTen = FixedNumber.from(fee)
      .divUnsafe(FixedNumber.from(10))
      .toString();
    const amountInMulFeeDivTen = FixedNumber.from(
      amountIn !== "" ? formatInputDecimal(amountIn, tokenFrom) : "0"
    )
      .mulUnsafe(FixedNumber.from(feeDivTen))
      .toString();

    const swapFeeFixedNumber = FixedNumber.from(amountInMulFeeDivTen)
      .divUnsafe(FixedNumber.from(100))
      .toString();
    return swapFeeFixedNumber;
  }
};

const getAmountOutMin = (tokenTo, amountOut, slippage) => {
  if (tokenTo && amountOut && slippage) {
    const amountOutMulSlippage = FixedNumber.from(
      amountOut !== "" ? formatInputDecimal(amountOut, tokenTo) : "0"
    )
      .mulUnsafe(FixedNumber.from(slippage !== "" ? slippage.toString() : "0"))
      .toString();

    const amountOutMulSlippageDivOneHundred = FixedNumber.from(
      amountOutMulSlippage
    )
      .divUnsafe(FixedNumber.from(100))
      .toString();

    const amountOutMinFixedNumber = FixedNumber.from(
      amountOut !== "" ? formatInputDecimal(amountOut, tokenTo) : "0"
    )
      .subUnsafe(FixedNumber.from(amountOutMulSlippageDivOneHundred))
      .toString();

    return amountOutMinFixedNumber;
  }
};

const countAmountOutMin = (tokenTo, amountOut, slippage) => {
  if (tokenTo && amountOut && slippage) {
    return getDecimalForAsset(tokenTo) === PartialConstants.VEUSD_DECIMAL
      ? formatLocaleString(
          getAmountOutMin(tokenTo, amountOut, slippage),
          PartialConstants.VEUSD_DECIMAL,
          checkLengthDecimal(
            getAmountOutMin(tokenTo, amountOut, slippage),
            tokenTo
          )
        )
      : formatLocaleString(
          getAmountOutMin(tokenTo, amountOut, slippage),
          PartialConstants.DEFAULT_ASSET_DECIMAL,
          checkLengthDecimal(
            getAmountOutMin(tokenTo, amountOut, slippage),
            tokenTo
          )
        );
  }
};

export function useExchangeRate(amountIn, amountOut, tokenFrom, tokenTo) {
  return useMemo(
    () => countExchangeRate(amountIn, amountOut, tokenFrom, tokenTo),
    [amountIn, amountOut, tokenFrom, tokenTo]
  );
}

const countExchangeRate = (amountIn, amountOut, tokenFrom, tokenTo) => {
  if (amountIn && amountOut && tokenFrom && tokenTo) {
    const pricePaidPerTokenFrom = amountOut / Number(amountIn);
    const pricePaidPerTokenTo = Number(amountIn) / Number(amountOut);

    const pricePaidPerA = formatInputDecimal(pricePaidPerTokenFrom, tokenTo);

    const pricePaidPerB = formatInputDecimal(pricePaidPerTokenTo, tokenFrom);

    return {
      pricePaidPerA: toFixedLargeNumber(pricePaidPerA),
      pricePaidPerB: toFixedLargeNumber(pricePaidPerB),
    };
  }
};
