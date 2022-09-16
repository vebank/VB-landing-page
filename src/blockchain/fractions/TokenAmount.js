import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'

import { Rounding, TEN, SolidityType, ChainId } from '../../constants/swap.constants'
import { parseBigintIsh, validateSolidityTypeInstance } from '../../utils/lib'
import { Fraction } from './Fraction'
import { WVET } from '../Token'

const Big = toFormat(_Big)

export class TokenAmount extends Fraction {

    /**
     * Helper that calls the constructor with the ETHER currency
     * @param amount ether amount in wei
     */
     static ether(amount) {
        return new TokenAmount(WVET[ChainId.TESTNET], amount)
    }

    // amount _must_ be raw, i.e. in the native representation
    constructor(token, amount) {
        const parsedAmount = parseBigintIsh(amount)
        validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

        super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(token.decimals)))
        this.token = token
    }

    get raw() {
        return this.numerator
    }

    add(other) {    // other: TokenAmount
        invariant(this.token.equals(other.token), 'TOKEN')
        return new TokenAmount(this.token, JSBI.add(this.raw, other.raw))
    }

    subtract(other) {   // other: TokenAmount
        invariant(this.token.equals(other.token), 'TOKEN')
        return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw))
    }

    toSignificant(significantDigits = 6, format, rounding = Rounding.ROUND_DOWN) {
        return super.toSignificant(significantDigits, format, rounding)
    }

    toFixed(
        decimalPlaces = this.token.decimals,
        format,
        rounding = Rounding.ROUND_DOWN
    ) {
        invariant(decimalPlaces <= this.token.decimals, 'DECIMALS')
        return super.toFixed(decimalPlaces, format, rounding)
    }

    toExact(format = { groupSeparator: '' }) {
        Big.DP = this.token.decimals
        return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
    }
}
