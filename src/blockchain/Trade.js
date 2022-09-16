import invariant from 'tiny-invariant'

import { ONE, TradeType, ZERO } from '../constants/swap.constants'
import { sortedInsert } from '../utils/lib'
import { Fraction, TokenAmount, Price, Percent } from './fractions'
import { Route } from './Route'

function getSlippage(midPrice, inputAmount, outputAmount) { // inputAmount: TokenAmount, outputAmount: TokenAmount
    const exactQuote = midPrice.raw.multiply(inputAmount.raw)
    // calculate slippage := (exactQuote - outputAmount) / exactQuote
    const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
    return new Percent(slippage.numerator, slippage.denominator)
}

function computePriceImpact(midPrice, inputAmount, outputAmount) {
    const quotedOutputAmount = midPrice.quote(inputAmount)
    // calculate price impact := (exactQuote - outputAmount) / exactQuote
    const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount)
    return new Percent(priceImpact.numerator, priceImpact.denominator)
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator(inputAmountA, outputAmountA, inputAmountB, outputAmountB) {
    // must have same input and output token for comparison
    invariant(inputAmountA.token.equals(inputAmountB.token), 'INPUT_TOKEN')
    invariant(outputAmountA.token.equals(outputAmountB.token), 'OUTPUT_TOKEN')
    if (outputAmountA.equalTo(outputAmountB)) {
        if (inputAmountA.equalTo(inputAmountB)) {
            return 0
        }
        // trade A requires less input than trade B, so A should come first
        if (inputAmountA.lessThan(inputAmountB)) {
            return -1
        } else {
            return 1
        }
    } else {
        // tradeA has less output than trade B, so should come second
        if (outputAmountA.lessThan(outputAmountB)) {
            return 1
        } else {
            return -1
        }
    }
}

// extension of the input output comparator that also considers other dimensions of the trade in ranking them
export function tradeComparator(a, b) { // a: Trade, b: Trade
    const ioComp = inputOutputComparator(a.inputAmount, a.outputAmount, b.inputAmount, b.outputAmount)
    if (ioComp !== 0) {
        return ioComp
    }

    // consider lowest slippage next, since these are less likely to fail
    if (a.slippage.lessThan(b.slippage)) {
        return -1
    } else if (a.slippage.greaterThan(b.slippage)) {
        return 1
    }

    // finally consider the number of hops since each hop costs gas
    return a.route.path.length - b.route.path.length
}

// export interface BestTradeOptions {
//     // how many results to return
//     maxNumResults?: number
//     // the maximum number of hops a trade should contain
//     maxHops?: number
// }

export class Trade {
    // public readonly route: Route
    // public readonly tradeType: TradeType
    // public inputAmount: TokenAmount
    // public outputAmount: TokenAmount
    // public readonly executionPrice: Price
    // public readonly nextMidPrice: Price
    // public readonly slippage: Percent

    constructor(route, amount, tradeType) {  // route: Route, amount: TokenAmount, tradeType: TradeType
        invariant(amount.token.equals(tradeType === TradeType.EXACT_INPUT ? route.input : route.output), 'TOKEN')
        const amounts = new Array(route.path.length) // TokenAmount[]
        const nextPairs = new Array(route.pairs.length) // Pair[]
        if (tradeType === TradeType.EXACT_INPUT) {
            amounts[0] = amount
            for (let i = 0; i < route.path.length - 1; i++) {
                const pair = route.pairs[i]
                const [outputAmount, nextPair] = pair.getOutputAmount(amounts[i])
                amounts[i + 1] = outputAmount
                nextPairs[i] = nextPair
            }
        } else {
            amounts[amounts.length - 1] = amount
            for (let i = route.path.length - 1; i > 0; i--) {
                const pair = route.pairs[i - 1]
                const [inputAmount, nextPair] = pair.getInputAmount(amounts[i])
                amounts[i - 1] = inputAmount
                nextPairs[i - 1] = nextPair
            }
        }

        this.route = route
        this.tradeType = tradeType
        const inputAmount = amounts[0]
        const outputAmount = amounts[amounts.length - 1]
        this.inputAmount = inputAmount
        this.outputAmount = outputAmount
        this.executionPrice = new Price(route.input, route.output, inputAmount.raw, outputAmount.raw)
        this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input))
        this.slippage = getSlippage(route.midPrice, inputAmount, outputAmount)
        this.priceImpact = computePriceImpact(route.midPrice, inputAmount, outputAmount)
    }

    // get the minimum amount that must be received from this trade for the given slippage tolerance
    minimumAmountOut(slippageTolerance) {   // slippageTolerance: Percent, return TokenAmount
        invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
        if (this.tradeType === TradeType.EXACT_OUTPUT) {
            return this.outputAmount
        } else {
            return new TokenAmount(
                this.outputAmount.token,
                new Fraction(ONE)
                    .add(slippageTolerance)
                    .invert()
                    .multiply(this.outputAmount.raw).quotient
            )
        }
    }

    // get the maximum amount in that can be spent via this trade for the given slippage tolerance
    maximumAmountIn(slippageTolerance) { // slippageTolerance: Percent, return TokenAmount
        invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
        if (this.tradeType === TradeType.EXACT_INPUT) {
            return this.inputAmount
        } else {
            return new TokenAmount(
                this.inputAmount.token,
                new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient
            )
        }
    }

    // given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
    // amount to an output token, making at most `maxHops` hops
    // note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
    // the amount in among multiple routes.
    static bestTradeExactIn(
        pairs,  // Pair[]
        amountIn,   // TokenAmount
        tokenOut,   // Token
        { maxNumResults = 3, maxHops = 3 } = {},    // BestTradeOptions
        // used in recursion.
        currentPairs= [],   // Pair[]
        originalAmountIn = amountIn,    // TokenAmount
        bestTrades = []     // Trade[]
    ) {
        invariant(pairs.length > 0, 'PAIRS')
        invariant(maxHops > 0, 'MAX_HOPS')
        invariant(originalAmountIn === amountIn || currentPairs.length > 0, 'INVALID_RECURSION')

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i]
            // pair irrelevant
            if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue
            if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

            let amountOut   // TokenAmount
            try {
                ;[amountOut] = pair.getOutputAmount(amountIn)
            } catch (error) {
                // input too low
                if (error.isInsufficientInputAmountError) {
                    continue
                }
                throw error
            }
            // we have arrived at the output token, so this is the final trade of one of the paths
            if (amountOut.token.equals(tokenOut)) {
                sortedInsert(
                    bestTrades,
                    new Trade(
                        new Route([...currentPairs, pair], originalAmountIn.token),
                        originalAmountIn,
                        TradeType.EXACT_INPUT
                    ),
                    maxNumResults,
                    tradeComparator
                )
            } else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))

                // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
                Trade.bestTradeExactIn(
                    pairsExcludingThisPair,
                    amountOut,
                    tokenOut,
                    {
                        maxNumResults,
                        maxHops: maxHops - 1
                    },
                    [...currentPairs, pair],
                    originalAmountIn,
                    bestTrades
            )
            }
        }

        return bestTrades
    }

    // similar to the above method but instead targets a fixed output amount
    // given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
    // to an output token amount, making at most `maxHops` hops
    // note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
    // the amount in among multiple routes.
    static bestTradeExactOut(
        pairs,  // Pair[]
        tokenIn,    // Token
        amountOut,   // TokenAmount
        { maxNumResults = 3, maxHops = 3 } = {},    // BestTradeOptions
        // used in recursion.
        currentPairs = [],  // Pair[]
        originalAmountOut = amountOut,  // TokenAmount
        bestTrades = []    // Trade[]
    ) {
        invariant(pairs.length > 0, 'PAIRS')
        invariant(maxHops > 0, 'MAX_HOPS')
        invariant(originalAmountOut === amountOut || currentPairs.length > 0, 'INVALID_RECURSION')

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i]
            // pair irrelevant
            if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue
            if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

            let amountIn    // TokenAmount
            try {
                ;[amountIn] = pair.getInputAmount(amountOut)
            } catch (error) {
                // not enough liquidity in this pair
                if (error.isInsufficientReservesError) {
                    continue
                }
                throw error
            }
            // we have arrived at the input token, so this is the first trade of one of the paths
            if (amountIn.token.equals(tokenIn)) {
                sortedInsert(
                    bestTrades,
                    new Trade(new Route([pair, ...currentPairs], tokenIn), originalAmountOut, TradeType.EXACT_OUTPUT),
                    maxNumResults,
                    tradeComparator
                )
            } else if (maxHops > 1 && pairs.length > 1) {
                const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))

                // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops
                Trade.bestTradeExactOut(
                    pairsExcludingThisPair,
                    tokenIn,
                    amountIn,
                    {
                        maxNumResults,
                        maxHops: maxHops - 1
                    },
                    [pair, ...currentPairs],
                    originalAmountOut,
                    bestTrades
            )
            }
        }

        return bestTrades
    }
}
