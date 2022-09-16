import invariant from 'tiny-invariant'
import { find } from 'lodash'
import JSBI from 'jsbi'

import { ChainId, SolidityType } from '../constants'
import { ERC20_ABI }from '../abis/ERC20'
import { validateAndParseAddress, validateSolidityTypeInstance } from '../utils/lib'

let CACHE = {
    [ChainId.MAINNET]: {
        '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD
    }
}

export class Token {
    // public readonly chainId: ChainId
    // public readonly address: string
    // public readonly decimals: number
    // public readonly symbol?: string
    // public readonly name?: string

    static async fetchData(
        chainId,
        address,
        connex,
        symbol,
        name
    ) {     // return Promise<Token>
        const abi = find(ERC20_ABI, { name: 'decimals' })
        const method = connex.thor.account(address).method(abi)

        const parsedDecimals =
            typeof CACHE?.[chainId]?.[address] === 'number'
                ? CACHE[chainId][address]
                : await method.call().then(({ decoded }) => Number(decoded[0])).then((decimals) => {
                    CACHE = {
                        ...CACHE,
                        [chainId]: {
                            ...CACHE?.[chainId],
                            [address]: decimals
                        }
                    }
                    return decimals
                })
        return new Token(chainId, address, parsedDecimals, symbol, name)
    }

    constructor(chainId, address, decimals, symbol, name) {
        validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

        this.chainId = chainId
        this.address = validateAndParseAddress(address)
        this.decimals = decimals
        if (typeof symbol === 'string') this.symbol = symbol
        if (typeof name === 'string') this.name = name
    }

    equals(other) {     // other: Token, return boolean
        const equal = this.chainId === other.chainId && this.address === other.address
        if (equal) {
            invariant(this.decimals === other.decimals, 'DECIMALS')
            if (this.symbol && other.symbol) invariant(this.symbol === other.symbol, 'SYMBOL')
            if (this.name && other.name) invariant(this.name === other.name, 'NAME')
        }
        return equal
    }

    sortsBefore(other) {    // other: Token, return boolean
        invariant(this.chainId === other.chainId, 'CHAIN_IDS')
        invariant(this.address !== other.address, 'ADDRESSES')
        return this.address.toLowerCase() < other.address.toLowerCase()
    }
}

export const WVET = {
    [ChainId.MAINNET]: new Token(
        ChainId.MAINNET,
        '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
        18,
        'VET',
        'Vechain'
    ),
    [ChainId.TESTNET]: new Token(
        ChainId.TESTNET,
        '0xA00fe119Efa9d8F7Ef00aD16b4D702e6a5F6CB6A',
        18,
        'VET',
        'Vechain'
    ),
}
