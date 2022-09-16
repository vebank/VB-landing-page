import { useMemo } from "react";
import { usePair } from "./Pair";
import { ChainId, TradeType } from "../constants/swap.constants";
import { Token, WVET } from "../blockchain/Token";
import { DUMMY_VET } from "./constants";
import { Trade } from "../blockchain/Trade";
import { Percent, TokenAmount } from "../blockchain/fractions";
import { Route } from "../blockchain/Route";
import { Pair } from "../blockchain/Pair";
import JSBI from 'jsbi'

const TOKEN_VTHO = process.env.REACT_APP_TOKEN_VTHO;

const VTHO = new Token(ChainId.TESTNET, TOKEN_VTHO, 18, "VTHO", "VeThor");

const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export function computeTradePriceBreakdown(trade) {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
      ? undefined
      : ONE_HUNDRED_PERCENT.subtract(
          trade.route.pairs.reduce((currentFee) => currentFee.multiply(INPUT_FRACTION_AFTER_FEE), ONE_HUNDRED_PERCENT
      )
  )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
      ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
      : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
      realizedLPFee &&
      trade &&
      (trade.inputAmount instanceof TokenAmount
          ? new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
          : TokenAmount.ether(realizedLPFee.multiply(trade.inputAmount.raw).quotient))

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

function useAllCommonPairs(tokenA, tokenB) {
  const chainId = ChainId.TESTNET;

  // check for direct pair between tokens
  const pairBetween = usePair(tokenA, tokenB);

  // get token<->WVET pairs
  const aToWVET = usePair(tokenA, WVET[chainId]);
  const bToWVET = usePair(tokenB, WVET[chainId]);

  // get token<->VTHO pairs
  const aToVTHO = usePair(
    tokenA,
    chainId === ChainId.TESTNET ? VTHO : undefined
  );
  const bToVTHO = usePair(
    tokenB,
    chainId === ChainId.TESTNET ? VTHO : undefined
  );

  // get connecting pairs
  const VTHOToWVET = usePair(
    chainId === ChainId.TESTNET ? VTHO : undefined,
    WVET[chainId]
  );

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      [pairBetween, aToWVET, bToWVET, aToVTHO, bToVTHO, VTHOToWVET]
        // filter out invalid pairs
        .filter((p) => !!p)
        // filter out duplicated pairs
        .filter(
          (p, i, pairs) =>
            i ===
            pairs.findIndex(
              (pair) =>
                pair?.liquidityToken.address === p.liquidityToken.address
            )
        ),
    [pairBetween, aToWVET, bToWVET, aToVTHO, bToVTHO, VTHOToWVET]
  );
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(amountIn, tokenOut) {
  const inputToken = amountIn?.token;
  const outputToken = tokenOut;

  const tokenOutVet = tokenOut?.equals(DUMMY_VET[outputToken.chainId]);
  const tokenInVet = inputToken?.equals(DUMMY_VET[inputToken.chainId]);

  const tokenOutWvet = tokenOut?.equals(WVET[outputToken.chainId]);
  const tokenInWvet = inputToken?.equals(WVET[inputToken.chainId]);

  const allowedPairs = useAllCommonPairs(inputToken, outputToken);

  return useMemo(() => {
    if (amountIn && tokenOut && allowedPairs.length > 0) {
      if (tokenInVet && !tokenOutVet && !tokenOutWvet) {
        amountIn.token = WVET[inputToken.chainId];
        const trade =
          Trade.bestTradeExactIn(allowedPairs, amountIn, tokenOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null;
        if (trade) {
          trade.inputAmount.token = DUMMY_VET[inputToken.chainId];
          return trade;
        } else {
          return null;
        }
      } else if (!tokenInVet && !tokenInWvet && tokenOutVet) {
        const trade =
          Trade.bestTradeExactIn(
            allowedPairs,
            amountIn,
            WVET[outputToken.chainId],
            {
              maxHops: 1,
              maxNumResults: 1,
            }
          )[0] ?? null;
        if (trade) {
          trade.outputAmount.token = DUMMY_VET[outputToken.chainId];
          return trade;
        } else {
          return null;
        }
      } else if ((tokenInVet && tokenOutWvet) || (tokenInWvet && tokenOutVet)) {
        const amountOut = new TokenAmount(tokenOut, amountIn.raw);
        const route = new Route([new Pair(amountIn, amountOut)], inputToken);
        const trade = new Trade(route, amountIn, TradeType.EXACT_INPUT);
        trade.outputAmount = amountOut;
        return trade;
      } else {
        const trade = Trade.bestTradeExactIn(allowedPairs, amountIn, tokenOut, {
          maxHops: 2,
          maxNumResults: 1,
        });

        return trade[0] ?? null;
      }
    }
    return null;
  }, [
    allowedPairs,
    amountIn,
    tokenOut,
    inputToken,
    outputToken,
    tokenInVet,
    tokenInWvet,
    tokenOutVet,
    tokenOutWvet,
  ]);
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(tokenIn, amountOut) {
  const inputToken = tokenIn;
  const outputToken = amountOut?.token;

  const tokenOutVet = outputToken?.equals(DUMMY_VET[outputToken.chainId]);
  const tokenInVet = inputToken?.equals(DUMMY_VET[inputToken.chainId]);

  const tokenOutWvet = outputToken?.equals(WVET[outputToken.chainId]);
  const tokenInWvet = inputToken?.equals(WVET[inputToken.chainId]);

  const allowedPairs = useAllCommonPairs(inputToken, outputToken);

  return useMemo(() => {
    if (tokenIn && amountOut && allowedPairs.length > 0) {
      if (tokenOutVet && !tokenInVet && !tokenInWvet) {
        amountOut.token = WVET[1];
        const trade =
          Trade.bestTradeExactOut(allowedPairs, tokenIn, amountOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null;
        if (trade) {
          trade.outputAmount.token = DUMMY_VET[inputToken.chainId];
          return trade;
        } else {
          return null;
        }
      } else if (tokenInVet && !tokenOutWvet && !tokenOutVet) {
        const trade =
          Trade.bestTradeExactOut(
            allowedPairs,
            WVET[outputToken.chainId],
            amountOut,
            {
              maxHops: 1,
              maxNumResults: 1,
            }
          )[0] ?? null;
        if (trade) {
          trade.inputAmount.token = DUMMY_VET[outputToken.chainId];
          return trade;
        } else {
          return null;
        }
      } else if ((tokenInVet && tokenOutWvet) || (tokenInWvet && tokenOutVet)) {
        const amountIn = new TokenAmount(inputToken, amountOut.raw);
        const route = new Route([new Pair(amountIn, amountOut)], inputToken);
        const trade = new Trade(route, amountIn, TradeType.EXACT_INPUT);
        trade.outputAmount = amountOut;
        return trade;
      } else {
        return (
          Trade.bestTradeExactOut(allowedPairs, tokenIn, amountOut, {
            maxHops: 1,
            maxNumResults: 1,
          })[0] ?? null
        );
      }
    }
    return null;
  }, [
    allowedPairs,
    tokenIn,
    amountOut,
    inputToken,
    outputToken,
    tokenInVet,
    tokenInWvet,
    tokenOutVet,
    tokenOutWvet,
  ]);
}
