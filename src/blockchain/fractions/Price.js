import invariant from 'tiny-invariant'
import JSBI from 'jsbi'

import { TEN } from '../../constants'
import { Fraction } from './Fraction'
import { TokenAmount } from './TokenAmount'

export class Price extends Fraction {
    // input i.e. denominator
    // output i.e. numerator
    // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

    static fromRoute(route) {
        const prices = []
        for (const [i, pair] of route.pairs.entries()) {
            prices.push(
                route.path[i].equals(pair.token0)
                    ? new Price(pair.reserve0.token, pair.reserve1.token, pair.reserve0.raw, pair.reserve1.raw)
                    : new Price(pair.reserve1.token, pair.reserve0.token, pair.reserve1.raw, pair.reserve0.raw)
            )
        }
        return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
    }

    // denominator and numerator _must_ be raw, i.e. in the native representation
    constructor(baseToken, quoteToken, denominator, numerator) {
        super(numerator, denominator)

        this.baseToken = baseToken
        this.quoteToken = quoteToken
        this.scalar = new Fraction(
            JSBI.exponentiate(TEN, JSBI.BigInt(baseToken.decimals)),
            JSBI.exponentiate(TEN, JSBI.BigInt(quoteToken.decimals))
        )
    }

    get raw() {
        return new Fraction(this.numerator, this.denominator)
    }

    get adjusted() {
        return super.multiply(this.scalar)
    }

    invert() {
        return new Price(this.quoteToken, this.baseToken, this.numerator, this.denominator)
    }

    multiply(other) {
        invariant(this.quoteToken.equals(other.baseToken), 'BASE')
        const fraction = super.multiply(other)
        return new Price(this.baseToken, other.quoteToken, fraction.denominator, fraction.numerator)
    }

    // performs floor division on overflow
    quote(tokenAmount) {
        invariant(tokenAmount.token.equals(this.baseToken), 'TOKEN')
        return new TokenAmount(this.quoteToken, super.multiply(tokenAmount.raw).quotient)
    }

    toSignificant(significantDigits = 6, format, rounding) {
        return this.adjusted.toSignificant(significantDigits, format, rounding)
    }

    toFixed(decimalPlaces = 4, format, rounding) {
        return this.adjusted.toFixed(decimalPlaces, format, rounding)
    }
}
